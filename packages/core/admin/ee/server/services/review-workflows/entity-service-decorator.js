'use strict';

const { isNil } = require('lodash/fp');
const { ENTITY_STAGE_ATTRIBUTE } = require('../../constants/workflows');
const { hasRWEnabled, getDefaultWorkflow } = require('../../utils/review-workflows');

/**
 * Assigns the entity data to the default workflow stage if no stage is present in the data
 * @param {Object} data
 * @returns
 */
const getDataWithStage = async (data) => {
  if (!isNil(ENTITY_STAGE_ATTRIBUTE, data)) {
    const defaultWorkflow = await getDefaultWorkflow({ strapi });
    return { ...data, [ENTITY_STAGE_ATTRIBUTE]: defaultWorkflow.stages[0].id };
  }
  return data;
};

/**
 * Decorates the entity service with RW business logic
 * @param {object} service - entity service
 */
const decorator = (service) => ({
  async create(uid, opts = {}) {
    const model = strapi.getModel(uid);
    const hasRW = hasRWEnabled(model);

    if (!hasRW) {
      return service.create.call(this, uid, opts);
    }

    const data = await getDataWithStage(opts.data);
    return service.create.call(this, uid, {
      ...opts,
      data,
    });
  },
});

module.exports = () => ({
  decorator,
});
