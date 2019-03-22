const _ = require('lodash');
const utils = require('./utils')();

/**
 * Build a mongo query
 * @param {Object} options - Query options
 * @param {Object} options.model - The model you are querying
 * @param {Object} options.filers - An object with the possible filters (start, limit, sort, where)
 * @param {Object} options.populate - An array of paths to populate
 */
const buildQuery = ({ model, filters, populate = [] } = {}) => {
  // build a tree of paths to populate based on the filtering and the populate option
  const { populatePaths, wherePaths } = computePopulatedPaths({
    model,
    populate,
    where: filters.where,
  });

  // init the query with
  let query = model
    .aggregate(buildQueryAggregate(model, { paths: _.merge({}, populatePaths, wherePaths) }))
    .append(buildQueryMatches(model, filters));

  // apply sort
  if (_.has(filters, 'sort')) {
    const sortFilter = filters.sort.reduce((acc, sort) => {
      const { field, order } = sort;
      acc[field] = order === 'asc' ? 1 : -1;
      return acc;
    }, {});

    query = query.sort(sortFilter);
  }

  // apply start
  if (_.has(filters, 'start')) {
    query = query.skip(filters.start);
  }

  // apply limiy
  if (_.has(filters, 'limit') && filters.limit >= 0) {
    query = query.limit(filters.limit);
  }

  return {
    /**
     * Overrides the promise to rehydrate mongoose docs after the aggregation query
     */
    then(onSuccess, onError) {
      // hydrate function
      const hydrateFn = hydrateModel({
        model,
        populatedModels: populatePaths,
      });

      return query
        .then(async result => {
          const hydratedResults = await Promise.all(result.map(hydrateFn));

          // TODO: run this only when necessary
          const populatedResults = await model.populate(hydratedResults, [
            {
              path: 'related.ref',
            },
          ]);

          return populatedResults;
        })
        .then(onSuccess, onError);
    },
    /**
     * Pass through query.catch
     */
    catch(...args) {
      return query.catch(...args);
    },
    /**
     * Maps to query.count
     */
    count(...args) {
      return query.count(...args);
    },
    /**
     * Maps to query.group
     */
    group(...args) {
      return query.group(...args);
    },
    /**
     * Returns an array of plain JS object instead of mongoose documents
     */
    lean() {
      // return plain js objects without the transformations we normally do on find
      return this.then(results => {
        return results.map(r => r.toObject({ transform: false }));
      });
    },
  };
};

/**
 * Returns a tree of the paths to populate both for population and deep filtering purposes
 * @param {Object} options - Options
 * @param {Object} options.model - Model from which to populate
 * @param {Object} options.populate - Paths to populate
 * @param {Object} options.where - Where clauses we need to populate to filters
 */
const computePopulatedPaths = ({ model, populate = [], where = [] }) => {
  const castedPopulatePaths = populate
    .map(el => (Array.isArray(el) ? el.join('.') : el))
    .map(path => findModelPath({ rootModel: model, path }))
    .map(path => {
      const assocModel = findModelByPath({ rootModel: model, path });

      // autoload morph relations
      let extraPaths = [];
      if (assocModel) {
        extraPaths = assocModel.associations
          .filter(assoc => assoc.nature.toLowerCase().indexOf('morph') !== -1)
          .map(assoc => `${path}.${assoc.alias}`);
      }

      return [path, ...extraPaths];
    })
    .reduce((acc, paths) => acc.concat(paths), []);

  const castedWherePaths = where
    .map(({ field }) => findModelPath({ rootModel: model, path: field }))
    .filter(path => !!path);

  return {
    populatePaths: pathsToTree(castedPopulatePaths),
    wherePaths: pathsToTree(castedWherePaths),
  };
};

/**
 * Builds an object based on paths:
 * [
 *    'articles',
 *    'articles.tags.cateogry',
 *    'articles.tags.label',
 * ] => {
 *  articles: {
 *    tags: {
 *      category: {},
 *      label: {}
 *    }
 *  }
 * }
 * @param {Array<string>} paths - A list of paths to transform
 */
const pathsToTree = paths => paths.reduce((acc, path) => _.merge(acc, _.set({}, path, {})), {});

/**
 * Builds the aggregations pipeling of the query
 * @param {Object} model - Queried model
 * @param {Object} options - Options
 * @param {Object} options.paths - a tree of paths to aggregate e.g { article : { tags : { label: {}}}}
 */
const buildQueryAggregate = (model, { paths } = {}) => {
  return Object.keys(paths).reduce((acc, key) => {
    return acc.concat(buildLookup({ model, key, paths: paths[key] }));
  }, []);
};

/**
 * Build a lookup aggregation for a specific key
 * @param {Object} options - options
 * @param {Object} options.model - Queried model
 * @param {string} options.key - the attribute name to lookup on the model
 * @param {Object} options.paths - a tree of paths to aggregate inside the current lookup e.g { { tags : { label: {}}}
 */
const buildLookup = ({ model, key, paths }) => {
  const assoc = model.associations.find(a => a.alias === key);
  const assocModel = findModelByAssoc({ assoc });

  if (!assocModel) return [];

  return [
    {
      $lookup: {
        from: assocModel.collectionName,
        as: assoc.alias,
        let: {
          localId: '$_id',
          localAlias: `$${assoc.alias}`,
        },
        pipeline: []
          .concat(buildLookupMatch({ assoc }))
          .concat(buildQueryAggregate(assocModel, { paths })),
      },
    },
  ].concat(
    assoc.type === 'model'
      ? {
        $unwind: {
          path: `$${assoc.alias}`,
          preserveNullAndEmptyArrays: true,
        },
      }
      : []
  );
};

/**
 * Build a lookup match expression (equivalent to a SQL join condition)
 * @param {Object} options - options
 * @param {Object} options.assoc - The association on which is based the ematching xpression
 */
const buildLookupMatch = ({ assoc }) => {
  switch (assoc.nature) {
    case 'oneToOne': {
      return [
        {
          $match: {
            $expr: {
              $eq: [`$${assoc.via}`, '$$localId'],
            },
          },
        },
      ];
    }
    case 'oneToMany': {
      return {
        $match: {
          $expr: {
            $eq: [`$${assoc.via}`, '$$localId'],
          },
        },
      };
    }
    case 'oneWay':
    case 'manyToOne': {
      return {
        $match: {
          $expr: {
            $eq: ['$$localAlias', '$_id'],
          },
        },
      };
    }
    case 'manyToMany': {
      if (assoc.dominant === true) {
        return {
          $match: {
            $expr: {
              $in: ['$_id', '$$localAlias'],
            },
          },
        };
      }

      return {
        $match: {
          $expr: {
            $in: ['$$localId', `$${assoc.via}`],
          },
        },
      };
    }
    case 'manyToManyMorph':
    case 'oneToManyMorph': {
      return [
        { $unwind: { path: `$${assoc.via}`, preserveNullAndEmptyArrays: true } },
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [`$${assoc.via}.ref`, '$$localId'] },
                { $eq: [`$${assoc.via}.${assoc.filter}`, assoc.alias] },
              ],
            },
          },
        },
      ];
    }
    default:
      return [];
  }
};

const buildQueryMatches = (model, filters) => {
  if (_.has(filters, 'where') && Array.isArray(filters.where)) {
    return filters.where.map(whereClause => {
      return {
        $match: buildWhereClause(formatWhereClause(model, whereClause)),
      };
    });
  }

  return [];
};

const buildWhereClause = ({ field, operator, value }) => {
  switch (operator) {
    case 'eq':
      return { [field]: utils.valueToId(value) };
    case 'ne':
      return { [field]: { $ne: utils.valueToId(value) } };
    case 'lt':
      return { [field]: { $lt: value } };
    case 'lte':
      return { [field]: { $lte: value } };
    case 'gt':
      return { [field]: { $gt: value } };
    case 'gte':
      return { [field]: { $gte: value } };
    case 'in':
      return {
        [field]: {
          $in: Array.isArray(value) ? value.map(utils.valueToId) : [utils.valueToId(value)],
        },
      };
    case 'nin':
      return {
        [field]: {
          $nin: Array.isArray(value) ? value.map(utils.valueToId) : [utils.valueToId(value)],
        },
      };
    case 'contains': {
      return {
        [field]: {
          $regex: value,
          $options: 'i',
        },
      };
    }
    case 'ncontains':
      return {
        [field]: {
          $not: new RegExp(value, 'i'),
        },
      };
    case 'containss':
      return {
        [field]: {
          $regex: value,
        },
      };
    case 'ncontainss':
      return {
        [field]: {
          $not: new RegExp(value),
        },
      };

    default:
      throw new Error(`Unhandled whereClause : ${fullField} ${operator} ${value}`);
  }
};

const formatWhereClause = (model, { field, operator, value }) => {
  const { assoc, model: assocModel } = getAssociationFromFieldKey(model, field);

  const shouldFieldBeSuffixed =
    assoc &&
    !_.endsWith(field, assocModel.primaryKey) &&
    (['in', 'nin'].includes(operator) || // When using in or nin operators we want to apply the filter on the relation's primary key and not the relation itself
      (['eq', 'ne'].includes(operator) && utils.isMongoId(value))); // Only suffix the field if the operators are eq or ne and the value is a valid mongo id

  return {
    field: shouldFieldBeSuffixed ? `${field}.${assocModel.primaryKey}` : field,
    operator,
    value,
  };
};

const getAssociationFromFieldKey = (strapiModel, fieldKey) => {
  let model = strapiModel;
  let assoc;

  const parts = fieldKey.split('.');

  for (let key of parts) {
    assoc = model.associations.find(ast => ast.alias === key);
    if (assoc) {
      model = findModelByAssoc({ assoc });
    }
  }

  return {
    assoc,
    model,
  };
};

const hydrateModel = ({ model: rootModel, populatedModels }) => async obj => {
  const toSet = Object.keys(populatedModels).reduce((acc, key) => {
    const val = _.get(obj, key);
    if (!val) return acc;

    const assocModel = findModelByPath({ rootModel, path: key });

    if (!assocModel) return acc;
    const subHydrate = hydrateModel({
      model: assocModel,
      populatedModels: populatedModels[key],
    });

    acc.push({
      path: key,
      data: Array.isArray(val) ? Promise.all(val.map(v => subHydrate(v))) : subHydrate(val),
    });

    return acc;
  }, []);

  let doc = await rootModel.hydrate(obj);

  for (let setter of toSet) {
    _.set(doc, setter.path, await setter.data);
  }

  return doc;
};

const findModelByPath = ({ rootModel, path }) => {
  const parts = path.split('.');

  let tmpModel = rootModel;
  for (let part of parts) {
    const assoc = tmpModel.associations.find(ast => ast.alias === part);
    if (assoc) {
      tmpModel = findModelByAssoc({ assoc });
    }
  }

  return tmpModel;
};

const findModelPath = ({ rootModel, path }) => {
  const parts = path.split('.');

  let tmpModel = rootModel;
  let tmpPath = [];
  for (let part of parts) {
    const assoc = tmpModel.associations.find(ast => ast.alias === part);

    if (assoc) {
      tmpModel = findModelByAssoc({ assoc });
      tmpPath.push(part);
    }
  }

  return tmpPath.length > 0 ? tmpPath.join('.') : null;
};

const findModelByAssoc = ({ assoc }) => {
  const { models } = strapi.plugins[assoc.plugin] || strapi;
  return models[assoc.model || assoc.collection];
};

module.exports = buildQuery;
