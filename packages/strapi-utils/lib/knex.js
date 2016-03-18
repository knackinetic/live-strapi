'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Public node modules.
const _ = require('lodash');

// Logger.
const logger = require('./winston');

/**
 * Check if connection is valid
 */

module.exports = function (scope) {

  // First, make sure the application we have access to
  // the migration generator.
  try {
    require.resolve(path.resolve(scope.rootPath, 'node_modules', 'strapi-knex'));
  } catch (err) {
    logger.error('Impossible to call the Knex migration tool.');
    logger.error('You can install it with `$ npm install strapi-knex --save`.');
    process.exit(1);
  }

  // Try to access the databases config and register connections
  // in the Knex query builder.
  try {
    fs.accessSync(path.resolve(scope.rootPath, 'config', 'environments', scope.environment, 'databases.json'), fs.F_OK | fs.R_OK);
  } catch (err) {
    logger.error('No `databases.json` file detected at `' + path.resolve(scope.rootPath, 'config', 'environments', scope.environment) + '`.');
    logger.error(err);
    process.exit(1);
  }

  // Save the connections and the current DB config.
  scope.connections = JSON.parse(fs.readFileSync(path.resolve(scope.rootPath, 'config', 'environments', scope.environment, 'databases.json'))).connections;
  scope.dbConfig = _.merge(scope.connections[scope.connection], {
    migrations: {
      directory: path.resolve(scope.rootPath, 'data', 'migrations', scope.connection)
    },
    seeds: {
      directory: path.resolve(scope.rootPath, 'data', 'seeds', scope.connection)
    }
  });

  // Make sure the specified connection exists in config.
  if (!_.has(scope.connections, scope.connection)) {
    logger.error('No connection found for `' + scope.connection + '`.');
    process.exit(1);
  }

  // Make sure the needed client is installed.
  _.forEach(scope.connections, function (config) {
    try {
      scope.db = require(path.resolve(scope.rootPath, 'node_modules', 'knex'))(scope.dbConfig);
    } catch (err) {
      logger.error('The client `' + config.client + '` is not installed.');
      logger.error(err);
      process.exit(1);
    }
  });
};
