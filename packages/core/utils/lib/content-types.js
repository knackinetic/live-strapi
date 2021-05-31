'use strict';

const _ = require('lodash');
const pluralize = require('pluralize');
const { nameToSlug } = require('./string-formatting');

const SINGLE_TYPE = 'singleType';
const COLLECTION_TYPE = 'collectionType';

const ID_ATTRIBUTE = 'id';
const PUBLISHED_AT_ATTRIBUTE = 'published_at';
const CREATED_BY_ATTRIBUTE = 'created_by';
const UPDATED_BY_ATTRIBUTE = 'updated_by';
const DP_PUB_STATE_LIVE = 'live';
const DP_PUB_STATE_PREVIEW = 'preview';
const DP_PUB_STATES = [DP_PUB_STATE_LIVE, DP_PUB_STATE_PREVIEW];

const constants = {
  ID_ATTRIBUTE,
  PUBLISHED_AT_ATTRIBUTE,
  CREATED_BY_ATTRIBUTE,
  UPDATED_BY_ATTRIBUTE,
  DP_PUB_STATES,
  DP_PUB_STATE_LIVE,
  DP_PUB_STATE_PREVIEW,
  SINGLE_TYPE,
  COLLECTION_TYPE,
};

const getTimestamps = model => {
  const timestamps = _.get(model, 'options.timestamps', []);

  if (!_.isArray(timestamps)) {
    return [];
  }

  return timestamps;
};

const getTimestampsAttributes = model => {
  const timestamps = getTimestamps(model);

  return timestamps.reduce(
    (attributes, attributeName) => ({
      ...attributes,
      [attributeName]: { type: 'timestamp' },
    }),
    {}
  );
};

const getNonWritableAttributes = (model = {}) => {
  const nonWritableAttributes = _.reduce(
    model.attributes,
    (acc, attr, attrName) => (attr.writable === false ? acc.concat(attrName) : acc),
    []
  );

  return _.uniq([
    ID_ATTRIBUTE,
    model.primaryKey,
    ...getTimestamps(model),
    ...nonWritableAttributes,
  ]);
};

const getWritableAttributes = (model = {}) => {
  return _.difference(Object.keys(model.attributes), getNonWritableAttributes(model));
};

const isWritableAttribute = (model, attributeName) => {
  return getWritableAttributes(model).includes(attributeName);
};

const getNonVisibleAttributes = model => {
  const nonVisibleAttributes = _.reduce(
    model.attributes,
    (acc, attr, attrName) => (attr.visible === false ? acc.concat(attrName) : acc),
    []
  );

  return _.uniq([ID_ATTRIBUTE, model.primaryKey, ...getTimestamps(model), ...nonVisibleAttributes]);
};

const getVisibleAttributes = model => {
  return _.difference(_.keys(model.attributes), getNonVisibleAttributes(model));
};

const isVisibleAttribute = (model, attributeName) => {
  return getVisibleAttributes(model).includes(attributeName);
};

const hasDraftAndPublish = model => _.get(model, 'options.draftAndPublish', false) === true;

const isDraft = (data, model) =>
  hasDraftAndPublish(model) && _.get(data, PUBLISHED_AT_ATTRIBUTE) === null;

const isSingleType = ({ kind = COLLECTION_TYPE }) => kind === SINGLE_TYPE;
const isCollectionType = ({ kind = COLLECTION_TYPE }) => kind === COLLECTION_TYPE;
const isKind = kind => model => model.kind === kind;

const getPrivateAttributes = (model = {}) => {
  return _.union(
    strapi.config.get('api.responses.privateAttributes', []),
    _.get(model, 'options.privateAttributes', []),
    _.keys(_.pickBy(model.attributes, attr => !!attr.private))
  );
};

const isPrivateAttribute = (model = {}, attributeName) => {
  return model && model.privateAttributes && model.privateAttributes.includes(attributeName);
};

const isScalarAttribute = attribute => {
  return (
    !attribute.collection &&
    !attribute.model &&
    attribute.type !== 'component' &&
    attribute.type !== 'dynamiczone'
  );
};

const isMediaAttribute = attr => {
  return (attr.collection || attr.model) === 'file' && attr.plugin === 'upload';
};

const getKind = obj => obj.kind || 'collectionType';

const pickSchema = model => {
  const schema = _.cloneDeep(
    _.pick(model, [
      'connection',
      'collectionName',
      'info',
      'options',
      'pluginOptions',
      'attributes',
    ])
  );

  schema.kind = getKind(model);
  return schema;
};

const createContentType = (model, { apiName, pluginName } = {}) => {
  // todo : validate schema with yup
  const createdContentType = _.cloneDeep(model);
  const singularModelName = nameToSlug(model.singularName);
  const pluralModelName = nameToSlug(model.pluralName);

  if (apiName) {
    Object.assign(createdContentType, {
      uid: `application::${apiName}.${singularModelName}`,
      apiName,
      collectionName: model.collectionName || singularModelName,
      globalId: getGlobalId(createdContentType, singularModelName),
    });
  } else if (pluginName) {
    Object.assign(createdContentType, {
      uid: `plugins::${pluginName}.${singularModelName}`,
      plugin: pluginName,
      collectionName:
        createdContentType.collectionName || `${pluginName}_${singularModelName}`.toLowerCase(),
      globalId: getGlobalId(createdContentType, singularModelName, pluginName),
    });
  } else {
    Object.assign(createdContentType, {
      uid: `strapi::${singularModelName}`,
      plugin: 'admin',
      globalId: getGlobalId(createdContentType, singularModelName, 'admin'),
    });
  }

  Object.assign(createdContentType, {
    __schema__: pickSchema(createdContentType),
    kind: getKind(createdContentType),
    modelType: 'contentType',
    modelName: singularModelName,
    singularName: singularModelName,
    pluralName: pluralModelName,
  });
  Object.defineProperty(createdContentType, 'privateAttributes', {
    get() {
      return strapi.getModel(createdContentType.uid).privateAttributes;
    },
  });

  return createdContentType;
};

const getGlobalId = (model, modelName, prefix) => {
  let globalId = prefix ? `${prefix}-${modelName}` : modelName;

  return model.globalId || _.upperFirst(_.camelCase(globalId));
};

const isRelationalAttribute = attribute =>
  _.has(attribute, 'model') || _.has(attribute, 'collection');

/**
 * Checks if an attribute is of type `type`
 * @param {object} attribute
 * @param {string} type
 */
const isTypedAttribute = (attribute, type) => {
  return _.has(attribute, 'type') && attribute.type === type;
};

/**
 *  Returns a route prefix for a contentType
 * @param {object} contentType
 * @returns {string}
 */
const getContentTypeRoutePrefix = contentType => {
  return isSingleType(contentType)
    ? _.kebabCase(contentType.modelName)
    : _.kebabCase(pluralize(contentType.modelName));
};

module.exports = {
  isScalarAttribute,
  isMediaAttribute,
  isRelationalAttribute,
  isTypedAttribute,
  getPrivateAttributes,
  getTimestampsAttributes,
  isPrivateAttribute,
  constants,
  getNonWritableAttributes,
  getWritableAttributes,
  isWritableAttribute,
  getNonVisibleAttributes,
  getVisibleAttributes,
  isVisibleAttribute,
  hasDraftAndPublish,
  isDraft,
  isSingleType,
  isCollectionType,
  isKind,
  createContentType,
  getGlobalId,
  getContentTypeRoutePrefix,
};
