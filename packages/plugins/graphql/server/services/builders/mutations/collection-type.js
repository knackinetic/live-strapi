'use strict';

const { extendType } = require('nexus');
const { actionExists } = require('../../old/utils');

module.exports = ({ strapi }) => {
  const { service: getService } = strapi.plugin('graphql');

  const { naming } = getService('utils');
  const { transformArgs } = getService('builders').utils;

  const {
    getCreateMutationTypeName,
    getUpdateMutationTypeName,
    getDeleteMutationTypeName,
    getEntityResponseName,
    getContentTypeInputName,
  } = naming;

  const addCreateMutation = (t, contentType) => {
    const { uid } = contentType;

    const createMutationName = getCreateMutationTypeName(contentType);
    const responseTypeName = getEntityResponseName(contentType);

    // If the action doesn't exist, return early and don't add the mutation
    if (!actionExists({ resolver: `${uid}.create` })) {
      return;
    }

    t.field(createMutationName, {
      type: responseTypeName,

      args: {
        // Create payload
        data: getContentTypeInputName(contentType),
      },

      async resolve(parent, args) {
        const transformedArgs = transformArgs(args, { contentType });

        const { create } = getService('builders')
          .get('content-api')
          .buildMutationsResolvers({ contentType });

        const value = await create(parent, transformedArgs);

        return { value, info: { args: transformedArgs, resourceUID: uid } };
      },
    });
  };

  const addUpdateMutation = (t, contentType) => {
    const { uid } = contentType;

    const updateMutationName = getUpdateMutationTypeName(contentType);
    const responseTypeName = getEntityResponseName(contentType);

    // If the action doesn't exist, return early and don't add the mutation
    if (!actionExists({ resolver: `${uid}.update` })) {
      return;
    }

    // todo[v4]: Don't allow to filter using every unique attributes for now
    // Only authorize filtering using unique scalar fields for updateOne queries
    // const uniqueAttributes = getUniqueAttributesFiltersMap(attributes);

    t.field(updateMutationName, {
      type: responseTypeName,

      args: {
        // Query args
        id: 'ID',
        // todo[v4]: Don't allow to filter using every unique attributes for now
        // ...uniqueAttributes,

        // Update payload
        data: getContentTypeInputName(contentType),
      },

      async resolve(parent, args) {
        const transformedArgs = transformArgs(args, { contentType });

        const { update } = getService('builders')
          .get('content-api')
          .buildMutationsResolvers({ contentType });

        const value = await update(parent, transformedArgs);

        return { value, info: { args: transformedArgs, resourceUID: uid } };
      },
    });
  };

  const addDeleteMutation = (t, contentType) => {
    const { uid } = contentType;

    const deleteMutationName = getDeleteMutationTypeName(contentType);
    const responseTypeName = getEntityResponseName(contentType);

    // If the action doesn't exist, return early and don't add the mutation
    if (!actionExists({ resolver: `${uid}.delete` })) {
      return;
    }

    // todo[v4]: Don't allow to filter using every unique attributes for now
    // Only authorize filtering using unique scalar fields for updateOne queries
    // const uniqueAttributes = getUniqueAttributesFiltersMap(attributes);

    t.field(deleteMutationName, {
      type: responseTypeName,

      args: {
        // Query args
        id: 'ID',
        // todo[v4]: Don't allow to filter using every unique attributes for now
        // ...uniqueAttributes,
      },

      async resolve(parent, args) {
        const transformedArgs = transformArgs(args, { contentType });

        const { delete: deleteResolver } = getService('builders')
          .get('content-api')
          .buildMutationsResolvers({ contentType });

        const value = await deleteResolver(parent, args);

        return { value, info: { args: transformedArgs, resourceUID: uid } };
      },
    });
  };

  return {
    buildCollectionTypeMutations(contentType) {
      return extendType({
        type: 'Mutation',

        definition(t) {
          addCreateMutation(t, contentType);
          addUpdateMutation(t, contentType);
          addDeleteMutation(t, contentType);
        },
      });
    },
  };
};
