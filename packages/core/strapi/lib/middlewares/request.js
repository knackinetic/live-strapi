'use strict';

const { defaultsDeep } = require('lodash/fp');
const body = require('koa-body');
const qs = require('qs');

const defaults = {
  multipart: true,
  queryStringParser: {
    strictNullHandling: true,
    arrayLimit: 100,
    depth: 20,
  },
};

/**
 * Body parser hook
 */
const addQsParser = (app, settings) => {
  Object.defineProperty(app.request, 'query', {
    configurable: false,
    enumerable: true,
    /*
     * Get parsed query-string.
     */
    get() {
      const qstr = this.querystring;
      const cache = (this._querycache = this._querycache || {});
      return cache[qstr] || (cache[qstr] = qs.parse(qstr, settings));
    },

    /*
     * Set query-string as an object.
     */
    set(obj) {
      this.querystring = qs.stringify(obj);
    },
  });

  return app;
};

/**
 * @type {import('./').MiddlewareFactory}
 */
module.exports = (options, { strapi }) => {
  const { queryStringParser, ...bodyOptions } = defaultsDeep(defaults, options);

  addQsParser(strapi.server.app, queryStringParser);

  return async (ctx, next) => {
    // TODO: find a better way later
    if (ctx.url === '/graphql') {
      return next();
    }

    try {
      return body({ patchKoa: true, ...bodyOptions })(ctx, next);
    } catch (e) {
      if ((e || {}).message && e.message.includes('maxFileSize exceeded')) {
        throw strapi.errors.entityTooLarge('FileTooBig', {
          errors: [
            {
              id: 'parser.file.status.sizeLimit',
              message: `file is bigger than the limit size!`,
            },
          ],
        });
      }

      throw e;
    }
  };
};
