'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const path = require('path');

// Public modules
const _ = require('lodash');
const Koa = require('koa');

/**
 * Public assets hook
 */

module.exports = strapi => {
  return {
    /**
     * Default options
     */

    defaults: {
      static: true
    },

    /**
     * Initialize the hook
     */

    initialize: function(cb) {
      if (strapi.config.middleware.settings.static === true) {
        const isIndexRoute = _.isEmpty(strapi.config.routes)
          ? false
          : strapi.config.routes.find(route => route.path === '/');

        strapi.app.use(
          strapi.koaMiddlewares.convert(
            strapi.koaMiddlewares.betterStatic(
              path.resolve(strapi.config.appPath, strapi.config.paths.static),
              {
                index: isIndexRoute ? false : 'index.html',
                maxage: 60000
              }
            )
          )
        );
      }

      // Mount static to a specific path (pattern: `/plugins/xXx`)
      _.forEach(strapi.plugins, (value, plugin) => {
        // Create koa sub-app
        const app = new Koa();

        app.use(
          strapi.koaMiddlewares.convert(
            strapi.koaMiddlewares.betterStatic(
              path.resolve(
                strapi.config.appPath,
                'plugins',
                plugin,
                strapi.config.paths.static
              )
            )
          )
        );

        strapi.app.use(
          strapi.koaMiddlewares.mount(path.join('/plugins', plugin), app)
        );
      });

      cb();
    }
  };
};
