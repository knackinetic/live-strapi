'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const bookshelf = require('bookshelf');
const pluralize = require('pluralize');

// Local helpers.
const utils = require('./utils/');

// Strapi helpers for models.
const utilsModels = require('strapi/lib/configuration/hooks/models/utils/');

/**
 * Bookshelf hook
 */

module.exports = function (strapi) {
  const hook = {

    /**
     * Default options
     */

    defaults: {
      defaultConnection: 'default'
    },

    /**
     * Initialize the hook
     */

    initialize: function (cb) {
      let globalName;
      let attributes = [];

      // Make sure the Knex hook is present since Knex needs it.
      if (!strapi.hooks.knex) {
        strapi.log.error('Impossible to load the ORM without the query builder!');
        strapi.log.error('You need to install the Strapi query builder with `$ npm install strapi-knex --save`.');
        strapi.stop(1);
      }

      // Only run this logic after the Knex has finished to load.
      strapi.after('hook:knex:loaded', function () {

        // Initialize collections
        _.set(strapi, 'bookshelf.collections', {});

        const loadedHook = _.after(_.size(strapi.models), function () {
          cb();
        });

        // Return callback if there is no model
        if (_.isEmpty(strapi.models)) {
          cb();
        }

        // Parse every registered model.
        _.forEach(strapi.models, function (definition, model) {
          globalName = _.capitalize(definition.globalId);

          // Make sure the model has a table name.
          // If not, use the model name.
          if (_.isEmpty(definition.tableName)) {
            definition.tableName = model;
          }

          // Make sure the model has a connection.
          // If not, use the default connection.
          if (_.isEmpty(definition.connection)) {
            definition.connection = strapi.config.defaultConnection;
          }

          // Make sure this connection exists.
          if (!_.has(strapi.config.connections, definition.connection)) {
            strapi.log.error('The connection `' + definition.connection + '` specified in the `' + model + '` model does not exist.');
            strapi.stop();
          }

          // Add some informations about ORM & client connection
          definition.orm = 'bookshelf';
          definition.client = _.get(strapi.config.connections[definition.connection], 'client');

          // Register the final model for Bookshelf.
          const loadedModel = {
            tableName: definition.tableName,
            hasTimestamps: definition.options.timestamps
          };

          // Initialize the global variable with the
          // capitalized model name.
          global[globalName] = {};

          // Call this callback function after we are done parsing
          // all attributes for relationships-- see below.
          const done = _.after(_.size(definition.attributes), function () {
            try {
              // Initialize lifecycle callbacks.
              loadedModel.initialize = function() {
                const self = this;
                const lifecycle = {
                  creating: 'beforeCreate',
                  created: 'afterCreate',
                  destroying: 'beforeDestroy',
                  destroyed: 'afterDestroy',
                  updating: 'beforeUpdate',
                  updated: 'afterUpdate',
                  fetching: 'beforeFetch',
                  fetched: 'afterFetch',
                  saving: 'beforeSave',
                  saved: 'afterSave'
                };

                _.forEach(lifecycle, function(fn, key) {
                  if (_.isFunction(strapi.models[model.toLowerCase()][fn])) {
                    self.on(key, strapi.models[model.toLowerCase()][fn]);
                  }
                });
              };

              const ORM = bookshelf(strapi.connections[definition.connection]);

              global[globalName] = ORM.Model.extend(loadedModel);
              global[pluralize(globalName)] = ORM.Collection.extend({
                model: global[globalName]
              });

              // Push model to strapi global variables.
              strapi.bookshelf.collections[globalName.toLowerCase()] = global[globalName];

              // Push attributes to be aware of model schema.
              strapi.bookshelf.collections[globalName.toLowerCase()]._attributes = definition.attributes;

              loadedHook();
            } catch (err) {
              strapi.log.error('Impossible to register the `' + model + '` model.');
              strapi.log.error(err);
              strapi.stop();
            }
          });

          if (_.isEmpty(definition.attributes)) {
            done();
          }

          // Add every relationships to the loaded model for Bookshelf.
          // Basic attributes don't need this-- only relations.
          _.forEach(definition.attributes, function (details, name) {
            const verbose = _.get(utilsModels.getNature(details, name), 'verbose') || '';

            // Build associations key
            if (!_.isEmpty(verbose)) {
              utilsModels.defineAssociations(globalName, definition, details, name)
            }

            switch (verbose) {
              case 'hasOne':
                // Looking for foreign key on one-to-one relation
                const FK = _.findKey(strapi.models[details.model].attributes, function(details) {
                  if (details.hasOwnProperty('model') && details.model === model && details.hasOwnProperty('via') && details.via === name) {
                    return details;
                  }
                });

                loadedModel[name] = function () {
                  return this.hasOne(global[_.capitalize(details.model)], FK);
                };
                break;

              case 'hasMany':
                loadedModel[name] = function () {
                  return this.hasMany(global[_.capitalize(details.collection)], details.via);
                };
                break;

              case 'belongsTo':
                loadedModel[name] = function () {
                  return this.belongsTo(global[_.capitalize(details.model)], name);
                };
                break;

              case 'belongsToMany':
                const tableName = _.map(_.sortBy([strapi.models[details.collection].attributes[details.via], details], 'collection'), function (table) {
                  return _.snakeCase(pluralize.plural(table.collection) + ' ' + pluralize.plural(table.via));
                }).join('__');

                const relationship = _.clone(strapi.models[details.collection].attributes[details.via]);

                // Force singular foreign key
                relationship.attribute = pluralize.singular(relationship.collection);
                details.attribute = pluralize.singular(details.collection);

                // Define PK column
                details.column = utils.getPK(model, strapi.models);
                relationship.column = utils.getPK(details.collection, strapi.models);

                // Sometimes the many-to-many relationships
                // is on the same keys on the same models (ex: `friends` key in model `User`)
                if (details.attribute + '_' + details.column === relationship.attribute + '_' + relationship.column) {
                  relationship.attribute = pluralize.singular(details.via);
                }

                loadedModel[name] = function () {
                  return this.belongsToMany(global[_.capitalize(details.collection)], tableName, relationship.attribute + '_' + relationship.column, details.attribute + '_' + details.column);
                };
                break;

              default:
                break;
            }

            done();
          });
        });
      });
    }
  };

  return hook;
};
