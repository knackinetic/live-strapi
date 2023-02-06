'use strict';

// eslint-disable-next-line node/no-extraneous-require
const { features } = require('@strapi/strapi/lib/utils/ee');
const executeCEBootstrap = require('../../server/bootstrap');
const { getService } = require('../../server/utils');
const actions = require('./config/admin-actions');

module.exports = async () => {
  const { actionProvider } = getService('permission');

  if (features.isEnabled('sso')) {
    await actionProvider.registerMany(actions.sso);
  }

  if (features.isEnabled('audit-logs')) {
    await actionProvider.registerMany(actions.auditLogs);
  }

  if (features.isEnabled('review-workflows')) {
    const { bootstrap: rwBootstrap } = getService('review-workflows');

    await rwBootstrap();
  }

  // TODO: check admin seats
  await executeCEBootstrap();
};
