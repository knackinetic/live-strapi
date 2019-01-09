'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const path = require('path');

// Public node modules.
const _ = require('lodash');

/* eslint-disable prefer-template */
// Array of supported clients.
const CLIENTS = [
  'pg',
  'mysql', 'mysql2',
  'sqlite3',
  'mariasql',
  'oracle', 'strong-oracle',
  'mssql',
  'websql'
];

/**
 * Knex hook
 */

module.exports = strapi => {
  const hook = {

    /**
     * Default options
     */

    defaults: {
      connection: {
        host: 'localhost',
        charset: 'utf8'
      }
    },

    /**
     * Initialize the hook
     */

    initialize: cb => {
      // For each connection in the config register a new Knex connection.
      _.forEach(_.pickBy(strapi.config.connections, {connector: 'strapi-hook-bookshelf'}), (connection, name) => {

        // Make sure we use the client even if the typo is not the exact one.
        switch (connection.settings.client) {
          case 'postgre':
          case 'postgres':
          case 'postgresql':
            connection.settings.client = 'pg';
            break;
          case 'sqlite':
            connection.settings.client = 'sqlite3';
            break;
          case 'maria':
          case 'mariadb':
            connection.settings.client = 'mariasql';
            break;
          case 'ms':
            connection.settings.client = 'mssql';
            break;
          case 'web':
            connection.settings.client = 'websql';
            break;
        }

        // Make sure the client is supported.
        if (!_.includes(CLIENTS, connection.settings.client)) {
          strapi.log.error('The client `' + connection.settings.client + '` for the `' + name + '` connection is not supported.');
          strapi.stop();
        }

        // Make sure the client is installed in the application
        // `node_modules` directory.
        let client;
        try {
          client = require(path.resolve(strapi.config.appPath, 'node_modules', connection.settings.client));
        } catch (err) {
          strapi.log.error('The client `' + connection.settings.client + '` is not installed.');
          strapi.log.error('You can install it with `$ npm install ' + connection.settings.client + ' --save`.');
          strapi.stop();
        }

        const options = _.defaultsDeep({
          client: connection.settings.client,
          connection: {
            host: _.get(connection.settings, 'host'),
            user: _.get(connection.settings, 'username') || _.get(connection.settings, 'user'),
            password: _.get(connection.settings, 'password'),
            database: _.get(connection.settings, 'database'),
            charset: _.get(connection.settings, 'charset'),
            schema: _.get(connection.settings, 'schema') || 'public',
            port: _.get(connection.settings, 'port'),
            socket: _.get(connection.settings, 'socketPath'),
            ssl: _.get(connection.settings, 'ssl') || false,
            timezone: _.get(connection.settings, 'timezone') || 'utc',
          },
          debug: _.get(connection.options, 'debug') || false,
          acquireConnectionTimeout: _.get(connection.options, 'acquireConnectionTimeout'),
          migrations: _.get(connection.options, 'migrations')
        }, strapi.config.hook.settings.knex);

        options.pool = {
          min: _.get(connection.options, 'pool.min') || 0,
          max: _.get(connection.options, 'pool.max') || 10,
          acquireTimeoutMillis: _.get(connection.options, 'pool.acquireTimeoutMillis') || 2000,
          createTimeoutMillis: _.get(connection.options, 'pool.createTimeoutMillis') || 2000,
          idleTimeoutMillis: _.get(connection.options, 'pool.idleTimeoutMillis') || 30000,
          reapIntervalMillis: _.get(connection.options, 'pool.reapIntervalMillis') || 1000,
          createRetryIntervalMillis: _.get(connection.options, 'pool.createRetryIntervalMillis') || 200,
        };

        if (options.client === 'pg') {
          client.types.setTypeParser(1700, 'text', parseFloat);

          if (_.isString(_.get(options.connection, 'schema'))) {
            options.pool = {
              afterCreate: (conn, cb) => {
                // conn.query(`SET SESSION SCHEMA '${options.connection.schema}';`, (err) => { // It seems the right way is the one below
                conn.query(`SET search_path TO '${options.connection.schema}';`, (err) => {
                  cb(err, conn);
                });
              }
            };
          } else {
            delete options.connection.schema;
          }
        }

        if (options.client === 'mysql') {
          options.connection.typeCast = (field, next) => {
            if (field.type === 'TINY' && field.length === 1) {
              return (field.string() === '1');
            }
            return next();
          };
        }

        // Finally, use the client via `knex`.
        // If anyone has a solution to use different paths for `knex` and clients
        // please drop us an email at support@strapi.io-- it would avoid the Strapi
        // applications to have `knex` as a dependency.
        try {
          // Try to require from local dependency.
          _.set(strapi, `connections.${name}`, require(path.resolve(strapi.config.appPath, 'node_modules', 'knex'))(options));
        } catch (err) {
          strapi.log.error('Impossible to use the `' + name + '` connection...');
          strapi.log.warn('Be sure that your client `' + name + '` are in the same node_modules directory');
          strapi.log.error(err);
          strapi.stop();
        }
      });

      cb();
    }
  };

  return hook;
};
