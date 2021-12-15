'use strict';

/**
 * Converts the standard Strapi REST query params to a more usable format for querying
 * You can read more here: https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest-api.html#filters
 */
const { has, isEmpty } = require('lodash/fp');
const _ = require('lodash');
const parseType = require('./parse-type');
const contentTypesUtils = require('./content-types');

const { PUBLISHED_AT_ATTRIBUTE } = contentTypesUtils.constants;

class InvalidOrderError extends Error {
  constructor() {
    super();
    this.message = 'Invalid order. order can only be one of asc|desc|ASC|DESC';
  }
}
class InvalidSortError extends Error {
  constructor() {
    super();
    this.message =
      'Invalid sort parameter. Expected a string, an array of strings, a sort object or an array of sort objects';
  }
}

const validateOrder = order => {
  if (!['asc', 'desc'].includes(order.toLocaleLowerCase())) {
    throw new InvalidOrderError();
  }
};

const convertCountQueryParams = countQuery => {
  return parseType({ type: 'boolean', value: countQuery });
};

/**
 * Sort query parser
 * @param {string} sortQuery - ex: id:asc,price:desc
 */
const convertSortQueryParams = sortQuery => {
  if (typeof sortQuery === 'string') {
    return sortQuery.split(',').map(value => convertSingleSortQueryParam(value));
  }

  if (Array.isArray(sortQuery)) {
    return sortQuery.flatMap(sortValue => convertSortQueryParams(sortValue));
  }

  if (_.isPlainObject(sortQuery)) {
    return convertNestedSortQueryParam(sortQuery);
  }

  throw new InvalidSortError();
};

const convertSingleSortQueryParam = sortQuery => {
  // split field and order param with default order to ascending
  const [field, order = 'asc'] = sortQuery.split(':');

  if (field.length === 0) {
    throw new Error('Field cannot be empty');
  }

  validateOrder(order);

  return _.set({}, field, order);
};

const convertNestedSortQueryParam = sortQuery => {
  const transformedSort = {};
  for (const field in sortQuery) {
    const order = sortQuery[field];

    // this is a deep sort
    if (_.isPlainObject(order)) {
      transformedSort[field] = convertNestedSortQueryParam(order);
    } else {
      validateOrder(order);
      transformedSort[field] = order;
    }
  }

  return transformedSort;
};

/**
 * Start query parser
 * @param {string} startQuery
 */
const convertStartQueryParams = startQuery => {
  const startAsANumber = _.toNumber(startQuery);

  if (!_.isInteger(startAsANumber) || startAsANumber < 0) {
    throw new Error(`convertStartQueryParams expected a positive integer got ${startAsANumber}`);
  }

  return startAsANumber;
};

/**
 * Limit query parser
 * @param {string} limitQuery
 */
const convertLimitQueryParams = limitQuery => {
  const limitAsANumber = _.toNumber(limitQuery);

  if (!_.isInteger(limitAsANumber) || (limitAsANumber !== -1 && limitAsANumber < 0)) {
    throw new Error(`convertLimitQueryParams expected a positive integer got ${limitAsANumber}`);
  }

  if (limitAsANumber === -1) return null;

  return limitAsANumber;
};

class InvalidPopulateError extends Error {
  constructor() {
    super();
    this.message =
      'Invalid populate parameter. Expected a string, an array of strings, a populate object';
  }
}

// NOTE: we could support foo.* or foo.bar.* etc later on
const convertPopulateQueryParams = (populate, depth = 0) => {
  if (depth === 0 && populate === '*') {
    return true;
  }

  if (typeof populate === 'string') {
    return populate.split(',').map(value => _.trim(value));
  }

  if (Array.isArray(populate)) {
    // map convert
    return _.uniq(
      populate.flatMap(value => {
        if (typeof value !== 'string') {
          throw new InvalidPopulateError();
        }

        return value.split(',').map(value => _.trim(value));
      })
    );
  }

  if (_.isPlainObject(populate)) {
    const transformedPopulate = {};
    for (const key in populate) {
      transformedPopulate[key] = convertNestedPopulate(populate[key]);
    }

    return transformedPopulate;
  }

  throw new InvalidPopulateError();
};

const convertNestedPopulate = subPopulate => {
  if (subPopulate === '*') {
    return true;
  }

  if (_.isBoolean(subPopulate)) {
    return subPopulate;
  }

  if (!_.isPlainObject(subPopulate)) {
    throw new Error(`Invalid nested populate. Expected '*' or an object`);
  }

  // TODO: We will need to consider a way to add limitation / pagination
  const { sort, filters, fields, populate, count } = subPopulate;

  const query = {};

  if (sort) {
    query.orderBy = convertSortQueryParams(sort);
  }

  if (filters) {
    query.where = convertFiltersQueryParams(filters);
  }

  if (fields) {
    query.select = convertFieldsQueryParams(fields);
  }

  if (populate) {
    query.populate = convertPopulateQueryParams(populate);
  }

  if (count) {
    query.count = convertCountQueryParams(count);
  }

  return query;
};

const convertFieldsQueryParams = (fields, depth = 0) => {
  if (depth === 0 && fields === '*') {
    return undefined;
  }

  if (typeof fields === 'string') {
    const fieldsValues = fields.split(',').map(value => _.trim(value));
    return _.uniq(['id', ...fieldsValues]);
  }

  if (Array.isArray(fields)) {
    // map convert
    const fieldsValues = fields.flatMap(value => convertFieldsQueryParams(value, depth + 1));
    return _.uniq(['id', ...fieldsValues]);
  }

  throw new Error('Invalid fields parameter. Expected a string or an array of strings');
};

const convertFiltersQueryParams = (filters, type) => {
  const sanitizeFilters = (filters, type) => {
    if (Array.isArray(filters)) {
      return filters.map(filter => sanitizeFilters(filter, type));
    }

    for (const operator in filters) {
      const attribute = type.attributes[operator];

      if (attribute) {
        if (attribute.type === 'password') {
          delete filters[operator];
        }

        if (attribute.type === 'relation') {
          sanitizeFilters(filters[operator], strapi.getModel(attribute.target));

          if (isEmpty(filters[operator])) {
            delete filters[operator];
          }
        }

        continue;
      }

      if (!Array.isArray(filters[operator])) {
        throw new Error(`You can't filter on an attribute that doens't exists`);
      }

      filters[operator] = filters[operator].filter(filter => {
        if (isEmpty(filter)) {
          return false;
        }

        const key = Object.keys(filter)[0];

        if (['$and', '$or', '$not'].includes(key)) {
          sanitizeFilters(filter, type);
          return true;
        }

        const attribute = type.attributes[key];

        if (!attribute) {
          throw new Error(`You can't filter on an attribute that doens't exists`);
        }

        if (attribute.type === 'password') {
          return false;
        }

        if (attribute.type === 'relation') {
          sanitizeFilters(filter[key], strapi.getModel(attribute.target));

          if (isEmpty(filter)) {
            return false;
          }
        }

        return true;
      });
    }

    return filters;
  };

  return sanitizeFilters(filters, type);
};

const convertPublicationStateParams = (type, params = {}, query = {}) => {
  if (!type) {
    return;
  }

  const { publicationState } = params;

  if (!_.isNil(publicationState)) {
    if (!contentTypesUtils.constants.DP_PUB_STATES.includes(publicationState)) {
      throw new Error(
        `Invalid publicationState. Expected one of 'preview','live' received: ${publicationState}.`
      );
    }

    // NOTE: this is the query layer filters not the entity service filters
    query.filters = ({ meta }) => {
      if (publicationState === 'live' && has(PUBLISHED_AT_ATTRIBUTE, meta.attributes)) {
        return { [PUBLISHED_AT_ATTRIBUTE]: { $notNull: true } };
      }
    };
  }
};

module.exports = {
  convertSortQueryParams,
  convertStartQueryParams,
  convertLimitQueryParams,
  convertPopulateQueryParams,
  convertFiltersQueryParams,
  convertFieldsQueryParams,
  convertPublicationStateParams,
};
