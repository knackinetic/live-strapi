'use strict';

const { makeSchema, unionType } = require('nexus');

module.exports = ({ strapi }) => {
  // Type Registry
  let registry;
  // Builders Instances
  let builders;

  const { KINDS, GENERIC_MORPH_TYPENAME } = strapi.plugin('graphql').service('constants');
  const utils = strapi.plugin('graphql').service('utils');
  const { scalars, buildInternalTypes } = strapi.plugin('graphql').service('internals');

  const {
    getMorphRelationTypeName,
    getTypeName,
    getComponentName,
    getEntityName,
    getEntityResponseName,
    getEntityQueriesTypeName,
    getEntityMutationsTypeName,
    getEntityResponseCollectionName,
    getEnumName,
    getDynamicZoneName,
    getDynamicZoneInputName,
    getFiltersInputTypeName,
    getComponentInputName,
    getContentTypeInputName,
  } = utils.naming;
  const { isMorphRelation, isEnumeration, isDynamicZone } = utils.attributes;

  /**
   * Register needed GraphQL types for every content type
   * @param {object[]} contentTypes
   */
  const registerAPITypes = contentTypes => {
    for (const contentType of contentTypes) {
      const { kind, modelType } = contentType;

      // Generate enums & dynamic zones
      registerEnumsDefinition(contentType);
      registerDynamicZonesDefinition(contentType);
      registerFiltersDefinition(contentType);
      registerInputsDefinition(contentType);

      // Generate & register component's definition
      if (modelType === 'component') {
        registerComponent(contentType);
      }

      // Generate & register single type's definition
      else if (kind === 'singleType') {
        registerSingleType(contentType);
      }

      // Generate & register collection type's definition
      else if (kind === 'collectionType') {
        registerCollectionType(contentType);
      }
    }
  };

  const registerMorphTypes = contentTypes => {
    // Create & register a union type that includes every type or component registered
    const genericMorphType = builders.buildGenericMorphDefinition();
    registry.register(GENERIC_MORPH_TYPENAME, genericMorphType, { kind: KINDS.morph });

    // For every content type
    contentTypes.forEach(contentType => {
      const { attributes = {} } = contentType;

      // Isolate its polymorphic attributes
      const morphAttributes = Object.entries(attributes).filter(([, attribute]) =>
        isMorphRelation(attribute)
      );

      // For each one of those polymorphic attribute
      for (const [attributeName, attribute] of morphAttributes) {
        const name = getMorphRelationTypeName(contentType, attributeName);
        const { target } = attribute;

        // Ignore those whose target is not an array
        if (!Array.isArray(target)) {
          continue;
        }

        // Transform target UIDs into types names
        const members = target
          // Get content types definitions
          .map(uid => strapi.getModel(uid))
          // Resolve types names
          .map(contentType => getTypeName(contentType));

        // Register the new polymorphic union type
        registry.register(
          name,

          unionType({
            name,

            resolveType(obj) {
              const contentType = strapi.getModel(obj.__type);

              if (!contentType) {
                return null;
              }

              if (contentType.modelType === 'component') {
                return getComponentName(contentType);
              }

              return getTypeName(contentType);
            },

            definition(t) {
              t.members(...members);
            },
          }),

          { kind: KINDS.morph, contentType, attributeName }
        );
      }
    });
  };

  const registerComponent = contentType => {
    const name = getComponentName(contentType);
    const definition = builders.buildTypeDefinition(contentType);

    registry.register(name, definition, { kind: KINDS.component, contentType });
  };

  const registerSingleType = contentType => {
    const types = {
      base: getTypeName(contentType),
      entity: getEntityName(contentType),
      response: getEntityResponseName(contentType),
      queries: getEntityQueriesTypeName(contentType),
      mutations: getEntityMutationsTypeName(contentType),
    };

    const getConfig = kind => ({ kind, contentType });

    // Single type's definition
    registry.register(types.base, builders.buildTypeDefinition(contentType), getConfig(KINDS.type));

    // Higher level entity definition
    registry.register(
      types.entity,
      builders.buildEntityDefinition(contentType),
      getConfig(KINDS.entity)
    );

    // Responses definition
    registry.register(
      types.response,
      builders.buildResponseDefinition(contentType),
      getConfig(KINDS.entityResponse)
    );

    // Queries
    registry.register(
      types.queries,
      builders.buildSingleTypeQueries(contentType),
      getConfig(KINDS.query)
    );

    registry.register(
      types.mutations,
      builders.buildSingleTypeMutations(contentType),
      getConfig(KINDS.mutation)
    );
  };

  const registerCollectionType = contentType => {
    // Types name (as string)
    const types = {
      base: getTypeName(contentType),
      entity: getEntityName(contentType),
      response: getEntityResponseName(contentType),
      responseCollection: getEntityResponseCollectionName(contentType),
      queries: getEntityQueriesTypeName(contentType),
      mutations: getEntityMutationsTypeName(contentType),
    };

    const getConfig = kind => ({ kind, contentType });

    // Type definition
    registry.register(types.base, builders.buildTypeDefinition(contentType), getConfig(KINDS.type));

    // Higher level entity definition
    registry.register(
      types.entity,
      builders.buildEntityDefinition(contentType),
      getConfig(KINDS.entity)
    );

    // Responses definition
    registry.register(
      types.response,
      builders.buildResponseDefinition(contentType),
      getConfig(KINDS.entityResponse)
    );

    registry.register(
      types.responseCollection,
      builders.buildResponseCollectionDefinition(contentType),
      getConfig(KINDS.entityResponseCollection)
    );

    // Query extensions
    registry.register(
      types.queries,
      builders.buildCollectionTypeQueries(contentType),
      getConfig(KINDS.query)
    );

    // Mutation extensions
    registry.register(
      types.mutations,
      builders.buildCollectionTypeMutations(contentType),
      getConfig(KINDS.mutation)
    );
  };

  const registerEnumsDefinition = contentType => {
    const { attributes } = contentType;

    const enumAttributes = Object.keys(attributes).filter(attributeName =>
      isEnumeration(attributes[attributeName])
    );

    for (const attributeName of enumAttributes) {
      const attribute = attributes[attributeName];

      const enumName = getEnumName(contentType, attributeName);
      const enumDefinition = builders.buildEnumTypeDefinition(attribute, enumName);

      registry.register(enumName, enumDefinition, {
        kind: KINDS.enum,
        contentType,
        attributeName,
        attribute,
      });
    }
  };

  const registerDynamicZonesDefinition = contentType => {
    const { attributes } = contentType;

    const dynamicZoneAttributes = Object.keys(attributes).filter(attributeName =>
      isDynamicZone(attributes[attributeName])
    );

    for (const attributeName of dynamicZoneAttributes) {
      const attribute = attributes[attributeName];
      const dzName = getDynamicZoneName(contentType, attributeName);
      const dzInputName = getDynamicZoneInputName(contentType, attributeName);

      const [type, input] = builders.buildDynamicZoneDefinition(attribute, dzName, dzInputName);

      if (type && input) {
        const baseConfig = {
          contentType,
          attributeName,
          attribute,
        };

        registry.register(dzName, type, { kind: KINDS.dynamicZone, ...baseConfig });
        registry.register(dzInputName, input, { kind: KINDS.input, ...baseConfig });
      }
    }
  };

  const registerFiltersDefinition = contentType => {
    const type = getFiltersInputTypeName(contentType);
    const definition = builders.buildContentTypeFilters(contentType);

    registry.register(type, definition, { kind: KINDS.filtersInput, contentType });
  };

  const registerInputsDefinition = contentType => {
    const { modelType } = contentType;

    const type = (modelType === 'component' ? getComponentInputName : getContentTypeInputName).call(
      null,
      contentType
    );

    const definition = builders.buildInputType(contentType);

    registry.register(type, definition, { kind: KINDS.input, contentType });
  };

  return () => {
    // Create a new empty type registry
    registry = strapi
      .plugin('graphql')
      .service('type-registry')
      .new();

    // Reset the builders instances associated to the
    // content-api, and link the new type registry
    builders = strapi
      .plugin('graphql')
      .service('builders')
      .new('content-api', registry);

    const contentTypes = [
      ...Object.values(strapi.components),
      ...Object.values(strapi.contentTypes),
    ];

    // Register needed scalar types
    Object.entries(scalars).forEach(([name, definition]) => {
      registry.register(name, definition, { kind: KINDS.scalar });
    });

    // Register Strapi's internal types
    const internalTypes = buildInternalTypes({ strapi });

    for (const [kind, definitions] of Object.entries(internalTypes)) {
      registry.registerMany(Object.entries(definitions), { kind });
    }

    // Generate and register definitions for every content type
    registerAPITypes(contentTypes);

    // Generate and register polymorphic types' definitions
    registerMorphTypes(contentTypes);

    // Return a brand new Nexus schema
    return makeSchema({
      // Exhaustive list of the content-api's types definitions
      types: registry.definitions,

      // Plugins
      plugins: [],

      // Auto-gen tools configuration (.graphql, .ts)
      // shouldGenerateArtifacts: process.env.NODE_ENV === 'development',
      //
      outputs: {
        // typegen: join(__dirname, '..', 'nexus-typegen.ts'),
        // schema: join(__dirname, '../../../../../..', 'schema.graphql'),
      },
    });
  };
};
