'use strict';
/**
 * Implementation of model queries for mongo
 */

const _ = require('lodash');
const {
  convertRestQueryParams,
  buildQuery,
  models: modelUtils,
} = require('strapi-utils');

module.exports = ({ model, modelKey, strapi }) => {
  const hasPK = obj => _.has(obj, model.primaryKey) || _.has(obj, 'id');
  const getPK = obj =>
    _.has(obj, model.primaryKey) ? obj[model.primaryKey] : obj.id;

  const assocKeys = model.associations.map(ast => ast.alias);
  const componentKeys = Object.keys(model.attributes).filter(key => {
    return model.attributes[key].type === 'component';
  });
  const excludedKeys = assocKeys.concat(componentKeys);

  const defaultPopulate = model.associations
    .filter(ast => ast.autoPopulate !== false)
    .map(ast => ast.alias);

  const pickRelations = values => {
    return _.pick(values, assocKeys);
  };

  const omitExernalValues = values => {
    return _.omit(values, excludedKeys);
  };

  async function createComponents(entry, values) {
    if (componentKeys.length === 0) return;

    for (let key of componentKeys) {
      const attr = model.attributes[key];
      const { component, required = false, repeatable = false } = attr;

      const componentModel = strapi.components[component];

      if (required === true && !_.has(values, key)) {
        const err = new Error(`Component ${key} is required`);
        err.status = 400;
        throw err;
      }

      if (!_.has(values, key)) continue;

      const componentValue = values[key];

      if (repeatable === true) {
        validateRepeatableInput(componentValue, { key, ...attr });
        const components = await Promise.all(
          componentValue.map(value => {
            return strapi.query(component).create(value);
          })
        );

        const componentsArr = components.map(componentEntry => ({
          kind: componentModel.globalId,
          ref: componentEntry,
        }));

        entry[key] = componentsArr;
        await entry.save();
      } else {
        validateNonRepeatableInput(componentValue, { key, ...attr });
        if (componentValue === null) continue;

        const componentEntry = await strapi
          .query(component)
          .create(componentValue);
        entry[key] = [
          {
            kind: componentModel.globalId,
            ref: componentEntry,
          },
        ];
        await entry.save();
      }
    }
  }

  async function updateComponents(entry, values) {
    if (componentKeys.length === 0) return;

    for (let key of componentKeys) {
      // if key isn't present then don't change the current component data
      if (!_.has(values, key)) continue;

      const attr = model.attributes[key];
      const { component, repeatable = false } = attr;

      const componentModel = strapi.components[component];
      const componentValue = values[key];

      const updateOrCreateComponent = async value => {
        // check if value has an id then update else create
        if (hasPK(value)) {
          return strapi.query(component).update(
            {
              [model.primaryKey]: getPK(value),
            },
            value
          );
        }
        return strapi.query(component).create(value);
      };

      if (repeatable === true) {
        validateRepeatableInput(componentValue, { key, ...attr });

        await deleteOldComponents(entry, componentValue, {
          key,
          componentModel,
        });

        const components = await Promise.all(
          componentValue.map(updateOrCreateComponent)
        );
        const componentsArr = components.map(component => ({
          kind: componentModel.globalId,
          ref: component,
        }));

        entry[key] = componentsArr;
        await entry.save();
      } else {
        validateNonRepeatableInput(componentValue, { key, ...attr });

        await deleteOldComponents(entry, componentValue, {
          key,
          componentModel,
        });

        if (componentValue === null) continue;

        const component = await updateOrCreateComponent(componentValue);
        entry[key] = [
          {
            kind: componentModel.globalId,
            ref: component,
          },
        ];
        await entry.save();
      }
    }
    return;
  }

  async function deleteOldComponents(
    entry,
    componentValue,
    { key, componentModel }
  ) {
    const componentArr = Array.isArray(componentValue)
      ? componentValue
      : [componentValue];

    const idsToKeep = componentArr.filter(hasPK).map(getPK);
    const allIds = await (entry[key] || [])
      .filter(el => el.ref)
      .map(el => el.ref._id);

    // verify the provided ids are realted to this entity.
    idsToKeep.forEach(id => {
      if (allIds.findIndex(currentId => currentId.toString() === id) === -1) {
        const err = new Error(
          `Some of the provided components in ${key} are not related to the entity`
        );
        err.status = 400;
        throw err;
      }
    });

    const idsToDelete = allIds.reduce((acc, id) => {
      if (idsToKeep.includes(id.toString())) return acc;
      return acc.concat(id);
    }, []);

    if (idsToDelete.length > 0) {
      await strapi
        .query(componentModel.uid)
        .delete({ [`${model.primaryKey}_in`]: idsToDelete });
    }
  }

  async function deleteComponents(entry) {
    if (componentKeys.length === 0) return;

    for (let key of componentKeys) {
      const attr = model.attributes[key];
      const { component } = attr;
      const componentModel = strapi.components[component];

      if (Array.isArray(entry[key]) && entry[key].length > 0) {
        const idsToDelete = entry[key].map(el => el.ref);
        await strapi
          .query(componentModel.uid)
          .delete({ [`${model.primaryKey}_in`]: idsToDelete });
      }
    }
  }

  function find(params, populate) {
    const populateOpt = populate || defaultPopulate;

    const filters = convertRestQueryParams(params);

    return buildQuery({
      model,
      filters,
      populate: populateOpt,
    }).then(results =>
      results.map(result => (result ? result.toObject() : null))
    );
  }

  async function findOne(params, populate) {
    const primaryKey = getPK(params);

    if (primaryKey) {
      params = {
        [model.primaryKey]: primaryKey,
      };
    }

    const entry = await model
      .findOne(params)
      .populate(populate || defaultPopulate);

    return entry ? entry.toObject() : null;
  }

  function count(params) {
    const filters = convertRestQueryParams(params);

    return buildQuery({
      model,
      filters: { where: filters.where },
    }).count();
  }

  async function create(values) {
    // Extract values related to relational data.
    const relations = pickRelations(values);
    const data = omitExernalValues(values);

    // Create entry with no-relational data.
    const entry = await model.create(data);

    await createComponents(entry, values);

    // Create relational data and return the entry.
    return model.updateRelations({
      [model.primaryKey]: getPK(entry),
      values: relations,
    });
  }

  async function update(params, values) {
    const primaryKey = getPK(params);

    if (primaryKey) {
      params = {
        [model.primaryKey]: primaryKey,
      };
    }

    const entry = await model.findOne(params);

    if (!entry) {
      const err = new Error('entry.notFound');
      err.status = 404;
      throw err;
    }

    // Extract values related to relational data.
    const relations = pickRelations(values);
    const data = omitExernalValues(values);

    // update components first in case it fails don't update the entity
    await updateComponents(entry, values);
    // Update entry with no-relational data.
    await entry.updateOne(data);

    // Update relational data and return the entry.
    return model.updateRelations(Object.assign(params, { values: relations }));
  }

  async function deleteMany(params) {
    const primaryKey = getPK(params);

    if (primaryKey) return deleteOne(params);

    const entries = await find(params);
    return await Promise.all(entries.map(entry => deleteOne({ id: entry.id })));
  }

  async function deleteOne(params) {
    const entry = await model
      .findOneAndRemove({ [model.primaryKey]: getPK(params) })
      .populate(defaultPopulate);

    if (!entry) {
      const err = new Error('entry.notFound');
      err.status = 404;
      throw err;
    }

    await deleteComponents(entry);

    await Promise.all(
      model.associations.map(async association => {
        if (!association.via || !entry._id || association.dominant) {
          return true;
        }

        const search =
          _.endsWith(association.nature, 'One') ||
          association.nature === 'oneToMany'
            ? { [association.via]: entry._id }
            : { [association.via]: { $in: [entry._id] } };
        const update =
          _.endsWith(association.nature, 'One') ||
          association.nature === 'oneToMany'
            ? { [association.via]: null }
            : { $pull: { [association.via]: entry._id } };

        // Retrieve model.
        const model = association.plugin
          ? strapi.plugins[association.plugin].models[
              association.model || association.collection
            ]
          : strapi.models[association.model || association.collection];

        return model.updateMany(search, update);
      })
    );

    return entry.toObject ? entry.toObject() : null;
  }

  function search(params, populate) {
    // Convert `params` object to filters compatible with Mongo.
    const filters = modelUtils.convertParams(modelKey, params);

    const $or = buildSearchOr(model, params._q);

    return model
      .find({ $or })
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate || defaultPopulate)
      .then(results =>
        results.map(result => (result ? result.toObject() : null))
      );
  }

  function countSearch(params) {
    const $or = buildSearchOr(model, params._q);
    return model.find({ $or }).countDocuments();
  }

  return {
    findOne,
    find,
    create,
    update,
    delete: deleteMany,
    count,
    search,
    countSearch,
  };
};

const buildSearchOr = (model, query) => {
  return Object.keys(model.attributes).reduce((acc, curr) => {
    switch (model.attributes[curr].type) {
      case 'integer':
      case 'float':
      case 'decimal':
        if (!_.isNaN(_.toNumber(query))) {
          return acc.concat({ [curr]: query });
        }

        return acc;
      case 'string':
      case 'text':
      case 'password':
        return acc.concat({ [curr]: { $regex: query, $options: 'i' } });
      case 'boolean':
        if (query === 'true' || query === 'false') {
          return acc.concat({ [curr]: query === 'true' });
        }

        return acc;
      default:
        return acc;
    }
  }, []);
};

function validateRepeatableInput(value, { key, min, max, required }) {
  if (!Array.isArray(value)) {
    const err = new Error(`Component ${key} is repetable. Expected an array`);
    err.status = 400;
    throw err;
  }

  value.forEach(val => {
    if (typeof val !== 'object' || Array.isArray(val) || val === null) {
      const err = new Error(
        `Component ${key} has invalid items. Expected each items to be objects`
      );
      err.status = 400;
      throw err;
    }
  });

  if (
    (required === true || (required !== true && value.length > 0)) &&
    (min && value.length < min)
  ) {
    const err = new Error(
      `Component ${key} must contain at least ${min} items`
    );
    err.status = 400;
    throw err;
  }

  if (max && value.length > max) {
    const err = new Error(`Component ${key} must contain at most ${max} items`);
    err.status = 400;
    throw err;
  }
}

function validateNonRepeatableInput(value, { key, required }) {
  if (typeof value !== 'object' || Array.isArray(value)) {
    const err = new Error(`Component ${key} should be an object`);
    err.status = 400;
    throw err;
  }

  if (required === true && value === null) {
    const err = new Error(`Component ${key} is required`);
    err.status = 400;
    throw err;
  }
}
