'use strict';

const auditLogContentType = require('./content-types/audit-log');

const provider = {
  async register({ strapi }) {
    strapi.container.get('content-types').add('admin::', { 'audit-log': auditLogContentType });

    // Return the provider object
    return {
      async saveEvent(event) {
        // Rewrite userId key to user
        const auditLog = { ...event, user: event.userId };
        delete auditLog.userId;

        // Save to database
        await strapi.entityService.create('admin::audit-log', { data: auditLog });

        return this;
      },
    };
  },

  async findMany(query) {
    if (!this._registered) {
      throw Error('Audit log provider has not been registered');
    }

    const result = await this.strapi.entityService.findPage('admin::audit-log', {
      populate: ['user'],
      ...query,
    });
    return result;
  },
};

module.exports = provider;
