'use strict';

const helmet = require('koa-helmet');

module.exports = strapi => ({
  initialize() {
    strapi.app.use(helmet(strapi.config.middleware.settings.helmet));
  },
});
