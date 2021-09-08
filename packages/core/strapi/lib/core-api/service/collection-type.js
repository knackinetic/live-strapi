'use strict';

const { propOr } = require('lodash/fp');

const {
  hasDraftAndPublish,
  constants: { PUBLISHED_AT_ATTRIBUTE },
} = require('@strapi/utils').contentTypes;

const {
  getPaginationInfo,
  convertPagedToStartLimit,
  shouldCount,
  transformPaginationResponse,
} = require('./pagination');

const setPublishedAt = data => {
  data[PUBLISHED_AT_ATTRIBUTE] = propOr(new Date(), PUBLISHED_AT_ATTRIBUTE, data);
};

/**
 *
 * Returns a collection type service to handle default core-api actions
 */
const createCollectionTypeService = ({ model, strapi, utils }) => {
  const { uid } = model;

  const { sanitizeInput, getFetchParams } = utils;

  return {
    async find(opts = {}) {
      const params = getFetchParams(opts.params);

      const paginationInfo = getPaginationInfo(params);

      const results = await strapi.entityService.find(uid, {
        params: { ...params, ...convertPagedToStartLimit(paginationInfo) },
      });

      if (shouldCount(params)) {
        const count = await strapi.entityService.count(uid, {
          params: { ...params, ...paginationInfo },
        });

        return {
          results,
          pagination: transformPaginationResponse(paginationInfo, count),
        };
      }

      return {
        results,
        pagination: paginationInfo,
      };
    },

    findOne(entityId, opts = {}) {
      const params = getFetchParams(opts.params);

      return strapi.entityService.findOne(uid, entityId, { params });
    },

    create({ params, data, files } = {}) {
      const sanitizedData = sanitizeInput(data);

      if (hasDraftAndPublish(model)) {
        setPublishedAt(sanitizedData);
      }

      return strapi.entityService.create(uid, { params, data: sanitizedData, files });
    },

    update(entityId, { params, data, files } = {}) {
      const sanitizedData = sanitizeInput(data);

      return strapi.entityService.update(uid, entityId, { params, data: sanitizedData, files });
    },

    delete(entityId, { params } = {}) {
      return strapi.entityService.delete(uid, entityId, { params });
    },
  };
};

module.exports = createCollectionTypeService;
