'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Local dependencies.
const routesJSON = require('../json/routes.json.js');

/**
 * Generate a core API
 */

module.exports = {
  templatesDirectory: scope => {
    try {
      // Try to reach the path. If it fail, throw an error.
      fs.accessSync(path.resolve(__dirname, '..', 'templates', scope.template), fs.constants.R_OK | fs.constants.W_OK);

      return path.resolve(__dirname, '..', 'templates', scope.template);
    } catch (e) {
      // Default template is Mongoose
      return path.resolve(__dirname, '..', 'templates', 'mongoose');
    }
  },
  before: require('./before'),
  targets: {

    // Use the default `controller` file as a template for
    // every generated controller.
    'api/:id/controllers/:filename': {
      template: 'controller.template'
    },

    // every generated controller.
    'api/:id/services/:filename': {
      template: 'service.template'
    },

    // Copy an empty JavaScript model where every functions will be.
    'api/:id/models/:filename': {
      template: 'model.template'
    },

    // Copy the generated JSON model for the connection,
    // schema and attributes.
    'api/:id/models/:filenameSettings': {
      template: 'model.settings.template'
    },

    // Generate routes.
    'api/:id/config/routes.json': {
      jsonfile: routesJSON
    }
  }
};
