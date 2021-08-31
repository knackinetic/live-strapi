'use strict';

const { yup, formatYupErrors } = require('@strapi/utils');
const constants = require('../services/constants');

const handleReject = error => Promise.reject(formatYupErrors(error));

const apiTokenCreationSchema = yup
  .object()
  .shape({
    name: yup
      .string()
      .min(1)
      .required(),
    description: yup.string().optional(),
    type: yup
      .string()
      .oneOf(Object.values(constants.API_TOKEN_TYPE))
      .required(),
  })
  .noUnknown();

const validateApiTokenCreationInput = async data => {
  return apiTokenCreationSchema
    .validate(data, { strict: true, abortEarly: false })
    .catch(handleReject);
};

module.exports = {
  validateApiTokenCreationInput,
};
