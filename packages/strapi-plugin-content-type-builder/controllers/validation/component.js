'use strict';

const _ = require('lodash');
const yup = require('yup');

const { isValidName } = require('./common');
const formatYupErrors = require('./yup-formatter');
const createSchema = require('./model-schema');

const VALID_RELATIONS = ['oneWay', 'manyWay'];
const VALID_TYPES = [
  // advanced types
  'media',

  // scalar types
  'string',
  'text',
  'richtext',
  'json',
  'enumeration',
  'password',
  'email',
  'integer',
  'biginteger',
  'float',
  'decimal',
  'date',
  'boolean',

  // nested component
  'component',
];

const createComponentSchema = () => {
  return createSchema(VALID_TYPES, VALID_RELATIONS).shape({
    icon: yup
      .string()
      .nullable()
      .test(isValidName),
    category: yup
      .string()
      .nullable()
      .test(isValidName),
  });
};

const validateComponentInput = data => {
  return createComponentSchema()
    .validate(data, {
      strict: true,
      abortEarly: false,
    })
    .catch(error => Promise.reject(formatYupErrors(error)));
};

const validateUpdateComponentInput = data => {
  // convert zero length string on default attributes to undefined
  if (_.has(data, 'attributes')) {
    Object.keys(data.attributes).forEach(attribute => {
      if (data.attributes[attribute].default === '') {
        data.attributes[attribute].default = undefined;
      }
    });
  }

  return createComponentSchema()
    .validate(data, {
      strict: true,
      abortEarly: false,
    })
    .catch(error => Promise.reject(formatYupErrors(error)));
};

module.exports = {
  validateComponentInput,
  validateUpdateComponentInput,
};
