'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');

// Strapi utilities.
const finder = require('strapi-utils').finder;
const regex = require('strapi-utils').regex;
const joijson = require('strapi-utils').joijson;
const policyUtils = require('strapi-utils').policy;
const { Joi } = require('koa-joi-router');

module.exports = strapi =>
  function routerChecker(value, endpoint, plugin) {
    const builder = joijson.builder(Joi);
    const route = regex.detectRoute(endpoint);

    // Define controller and action names.
    const [controllerName, actionName] = _.trim(value.handler).split('.');
    const controllerKey = _.toLower(controllerName);

    let controller;

    if (plugin) {
      controller = strapi.plugins[plugin].controllers[controllerKey];
    } else {
      controller =
        strapi.controllers[controllerKey] ||
        strapi.admin.controllers[controllerKey];
    }

    const action = controller[actionName].bind(controller);

    // Retrieve the API's name where the controller is located
    // to access to the right validators
    const currentApiName = finder(
      strapi.plugins[plugin] || strapi.api || strapi.admin,
      controller
    );

    // Init policies array.
    const policies = [];

    // Add the `globalPolicy`.
    policies.push(policyUtils.globalPolicy(endpoint, value, route, plugin));

    // Allow string instead of array of policies.
    if (
      !_.isArray(_.get(value, 'config.policies')) &&
      !_.isEmpty(_.get(value, 'config.policies'))
    ) {
      value.config.policies = [value.config.policies];
    }

    if (
      _.isArray(_.get(value, 'config.policies')) &&
      !_.isEmpty(_.get(value, 'config.policies'))
    ) {
      _.forEach(value.config.policies, policy => {
        policyUtils.get(policy, plugin, policies, endpoint, currentApiName);
      });
    }

    policies.push(async (ctx, next) => {
      // Set body.
      const values = await next();

      if (!ctx.body) {
        ctx.body = values;
      }
    });

    // Init validate.
    const validate = {};

    if (
      _.isString(_.get(value, 'config.validate')) &&
      !_.isEmpty(_.get(value, 'config.validate'))
    ) {
      const validator = _.get(
        strapi.api,
        currentApiName + '.validators.' + value.config.validate
      );

      _.merge(
        validate,
        _.mapValues(validator, value => {
          return builder.build(value);
        })
      );
    }

    return {
      route,
      policies,
      action,
      validate,
    };
  };
