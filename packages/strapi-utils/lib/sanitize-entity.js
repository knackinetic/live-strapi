'use strict';

const _ = require('lodash');

const sanitizeEntity = (dataSource, options) => {
  const { model, withPrivate = false, isOutput = true, includeFields = null } = options;

  if (typeof dataSource !== 'object' || _.isNil(dataSource)) {
    return dataSource;
  }

  const data = parseOriginalData(dataSource);

  if (typeof data !== 'object') {
    return data;
  }

  if (_.isNil(model)) {
    return null;
  }

  const { attributes } = model;
  const allowedFields = getAllowedFields({ includeFields, model, isOutput });

  const reducerFn = (acc, value, key) => {
    const attribute = attributes[key];
    const allowedFieldsHasKey = allowedFields.includes(key);

    if (shouldRemoveAttribute(attribute, { withPrivate, isOutput })) {
      return acc;
    }

    // Relations
    const relation = attribute && (attribute.model || attribute.collection || attribute.component);
    if (relation && value !== null) {
      const [nextFields, isAllowed] = getNextFields(allowedFields, key, { allowedFieldsHasKey });

      if (!isAllowed) {
        return acc;
      }

      const nextOptions = {
        model: strapi.getModel(relation, attribute.plugin),
        withPrivate,
        isOutput,
        includeFields: nextFields,
      };

      const nextVal = Array.isArray(value)
        ? value.map(elem => sanitizeEntity(elem, nextOptions))
        : sanitizeEntity(value, nextOptions);

      return { ...acc, [key]: nextVal };
    }

    // Dynamic zones
    if (attribute && attribute.components && value !== null && allowedFieldsHasKey) {
      const nextVal = value.map(elem =>
        sanitizeEntity(elem, {
          model: strapi.getModel(elem.__component),
          withPrivate,
          isOutput,
        })
      );
      return { ...acc, [key]: nextVal };
    }

    // Other fields
    const isAllowedField = !includeFields || allowedFieldsHasKey;
    if (isAllowedField) {
      return { ...acc, [key]: value };
    }

    return acc;
  };

  return _.reduce(data, reducerFn, {});
};

const parseOriginalData = data => (_.isFunction(data.toJSON) ? data.toJSON() : data);

const getAllowedFields = ({ includeFields, model, isOutput }) => {
  const { options, primaryKey } = model;

  const timestamps = options.timestamps || [];
  const creatorFields = ['created_by', 'updated_by'];
  const componentFields = ['__component'];

  return _.concat(
    includeFields || [],
    ...(isOutput
      ? [primaryKey, componentFields, timestamps, creatorFields]
      : [primaryKey, componentFields])
  );
};

const getNextFields = (fields, key, { allowedFieldsHasKey }) => {
  const searchStr = `${key}.`;

  const transformedFields = (fields || [])
    .filter(field => field.startsWith(searchStr))
    .map(field => field.replace(searchStr, ''));

  const isAllowed = allowedFieldsHasKey || transformedFields.length > 0;
  const nextFields = allowedFieldsHasKey ? null : transformedFields;

  return [nextFields, isAllowed];
};

const shouldRemoveAttribute = (attribute, { withPrivate, isOutput }) => {
  if (_.isNil(attribute)) {
    return false;
  }

  const isPassword = attribute.type === 'password';
  const isPrivate = attribute.private === true;

  const shouldRemovePassword = isOutput;
  const shouldRemovePrivate = !withPrivate && isOutput;

  return !!((isPassword && shouldRemovePassword) || (isPrivate && shouldRemovePrivate));
};

module.exports = sanitizeEntity;
