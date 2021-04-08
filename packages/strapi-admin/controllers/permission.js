'use strict';

const { validateCheckPermissionsInput } = require('../validation/permission');
const { getService } = require('../utils');
const { formatConditions } = require('./formatters');

module.exports = {
  /**
   * Check each permissions from `request.body.permissions` and returns an array of booleans
   * @param {KoaContext} ctx - koa context
   */
  async check(ctx) {
    const { body: input } = ctx.request;
    const { userAbility } = ctx.state;

    try {
      await validateCheckPermissionsInput(input);
    } catch (err) {
      return ctx.badRequest('ValidationError', err);
    }

    const { engine } = getService('permission');

    const checkPermissionsFn = engine.checkMany(userAbility);

    ctx.body = {
      data: checkPermissionsFn(input.permissions),
    };
  },

  /**
   * Returns every permissions, in nested format
   * @param {KoaContext} ctx - koa context
   */
  async getAll(ctx) {
    const { role: roleId } = ctx.query;

    const { sectionsBuilder, conditionProvider } = getService('permission');

    const actions = await getService('action').getActionsByRoleId(roleId);
    const conditions = conditionProvider.values();
    const sections = await sectionsBuilder.build(actions);

    ctx.body = {
      data: {
        conditions: formatConditions(conditions),
        sections,
      },
    };
  },
};
