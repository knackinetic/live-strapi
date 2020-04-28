'use strict';

const _ = require('lodash');
const constants = require('../constants');

class ModelError extends Error {
  constructor(message) {
    super(message);
    this.stack = null;
  }
}

const checkReservedAttributeNames = (model, { manager }) => {
  const reservedNames = [...constants.RESERVED_ATTRIBUTE_NAMES];

  if (_.has(model, 'options.timestamps')) {
    const [connectorCreatedAt, connectorUpdatedAt] = manager.connectors.getByConnection(
      model.connection
    ).defaultTimestamps;

    if (Array.isArray(model.options.timestamps)) {
      const [
        createdAtAttribute = connectorCreatedAt,
        updatedAtAttribute = connectorUpdatedAt,
      ] = model.options.timestamps;

      reservedNames.push(createdAtAttribute, updatedAtAttribute);
    } else {
      reservedNames.push(connectorCreatedAt, connectorUpdatedAt);
    }
  }

  const usedReservedAttributeNames = _.intersection(Object.keys(model.attributes), reservedNames);

  if (usedReservedAttributeNames.length > 0) {
    throw new ModelError(
      `Model "${
        model.modelName
      }" is using reserved attribute names "${usedReservedAttributeNames.join(
        ', '
      )}".\n-> Make sure you are not using a reserved name or overriding the defined timestamp attributes.`
    );
  }
};

const checkReservedModelName = model => {
  if (constants.RESERVED_MODEL_NAMES.includes(model.modelName)) {
    throw new ModelError(
      `"${model.modelName}" is a reserved model name. You need to rename your model and the files associated with it.`
    );
  }
};

/**
 * Checks that there are no model using reserved names (content type, component, attributes)
 */
module.exports = ({ strapi, manager }) => {
  Object.keys(strapi.api).forEach(apiName => {
    const api = strapi.api[apiName];

    const models = api.models ? Object.values(api.models) : [];
    models.forEach(model => {
      checkReservedModelName(model);
      checkReservedAttributeNames(model, { manager });
    });
  });

  Object.keys(strapi.plugins).forEach(pluginName => {
    const plugin = strapi.plugins[pluginName];

    const models = plugin.models ? Object.values(plugin.models) : [];
    models.forEach(model => {
      checkReservedModelName(model);
      checkReservedAttributeNames(model, { manager });
    });
  });
};
