'use strict';

const _ = require('lodash');
const yup = require('yup');
const { formatYupErrors } = require('strapi-utils');

const { isValidCategoryName, isValidIcon } = require('./common');
const createSchema = require('./model-schema');
const removeEmptyDefaults = require('./remove-empty-defaults');
const { modelTypes, DEFAULT_TYPES } = require('./constants');

const VALID_RELATIONS = ['oneWay', 'manyWay'];
const VALID_TYPES = [...DEFAULT_TYPES, 'component'];

const componentSchema = createSchema(VALID_TYPES, VALID_RELATIONS, {
  modelType: modelTypes.COMPONENT,
})
  .shape({
    icon: yup
      .string()
      .nullable()
      .test(isValidIcon)
      .required('icon.required'),
    category: yup
      .string()
      .nullable()
      .test(isValidCategoryName)
      .required('category.required'),
  })
  .required()
  .noUnknown();

const nestedComponentSchema = yup.array().of(
  componentSchema
    .shape({
      uid: yup.string(),
      tmpUID: yup.string(),
    })
    .test({
      name: 'mustHaveUIDOrTmpUID',
      message: 'Component must have a uid or a tmpUID',
      test: attr => {
        if (_.has(attr, 'uid') && _.has(attr, 'tmpUID')) return false;
        if (!_.has(attr, 'uid') && !_.has(attr, 'tmpUID')) return false;
        return true;
      },
    })
    .required()
    .noUnknown()
);

const validateComponentInput = data => {
  return yup
    .object({
      component: componentSchema,
      components: nestedComponentSchema,
    })
    .noUnknown()
    .validate(data, {
      strict: true,
      abortEarly: false,
    })
    .catch(error => Promise.reject(formatYupErrors(error)));
};

const validateUpdateComponentInput = data => {
  removeEmptyDefaults(data);

  return yup
    .object({
      component: componentSchema,
      components: nestedComponentSchema,
    })
    .noUnknown()
    .validate(data, {
      strict: true,
      abortEarly: false,
    })
    .catch(error => Promise.reject(formatYupErrors(error)));
};

module.exports = {
  validateComponentInput,
  validateUpdateComponentInput,

  nestedComponentSchema,
};
