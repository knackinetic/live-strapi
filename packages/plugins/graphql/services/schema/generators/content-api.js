'use strict';

const { prop } = require('lodash/fp');
const { makeSchema, unionType } = require('nexus');

const createBuilders = require('../builders');
const { utils, scalars, buildInternals } = require('../../types');

const { create: createTypeRegistry } = require('../../type-registry');

module.exports = strapi => {
  // todo[v4]: Get the service directly with something like strapi.plugin().service()
  const registry = createTypeRegistry();
  const builders = createBuilders({ strapi, registry });

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
    registry.register(
      'GenericMorph',

      unionType({
        name: 'GenericMorph',

        resolveType(obj) {
          return obj.__typename;
        },

        definition(t) {
          const members = registry
            .where(({ config: { kind } }) => ['types', 'components'].includes(kind))
            .map(prop('name'));

          t.members(...members);
        },
      }),
      { kind: 'morphs' }
    );

    contentTypes.forEach(contentType => {
      const { attributes = {} } = contentType;

      const morphAttributes = Object.entries(attributes).filter(([, attribute]) =>
        utils.isMorphRelation(attribute)
      );

      for (const [attributeName, attribute] of morphAttributes) {
        const name = utils.getMorphRelationTypeName(contentType, attributeName);
        const { target } = attribute;

        if (!Array.isArray(target)) {
          continue;
        }

        registry.register(
          name,

          unionType({
            name,

            resolveType(obj) {
              return obj.__typename;
            },

            definition(t) {
              // const members = backLinks.map(prop('definition'));
              const members = target || ['GenericMorph'];

              t.members(...members);
            },
          }),

          { kind: 'morphs', contentType, attributeName }
        );
      }
    });
  };

  const registerComponent = contentType => {
    const name = utils.getComponentName(contentType);
    const definition = builders.buildTypeDefinition(contentType);

    registry.register(name, definition, { kind: 'components', contentType });
  };

  const registerSingleType = contentType => {
    const types = {
      base: utils.getTypeName(contentType),
      entity: utils.getEntityName(contentType),
      response: utils.getEntityResponseName(contentType),
      queries: utils.getEntityQueriesTypeName(contentType),
      mutations: utils.getEntityMutationsTypeName(contentType),
    };

    const getConfig = kind => ({ kind, contentType });

    // Single type's definition
    registry.register(types.base, builders.buildTypeDefinition(contentType), getConfig('types'));

    // Higher level entity definition
    registry.register(
      types.entity,
      builders.buildEntityDefinition(contentType),
      getConfig('entities')
    );

    // Responses definition
    registry.register(
      types.response,
      builders.buildResponseDefinition(contentType),
      getConfig('entitiesResponses')
    );

    // Queries
    registry.register(
      types.queries,
      builders.buildSingleTypeQueries(contentType),
      getConfig('queries')
    );

    registry.register(
      types.mutations,
      builders.buildSingleTypeMutations(contentType),
      getConfig('mutations')
    );
  };

  const registerCollectionType = contentType => {
    // Types name (as string)
    const types = {
      base: utils.getTypeName(contentType),
      entity: utils.getEntityName(contentType),
      response: utils.getEntityResponseName(contentType),
      responseCollection: utils.getEntityResponseCollectionName(contentType),
      queries: utils.getEntityQueriesTypeName(contentType),
      mutations: utils.getEntityMutationsTypeName(contentType),
    };

    const getConfig = kind => ({ kind, contentType });

    // Type definition
    registry.register(types.base, builders.buildTypeDefinition(contentType), getConfig('types'));

    // Higher level entity definition
    registry.register(
      types.entity,
      builders.buildEntityDefinition(contentType),
      getConfig('entities')
    );

    // Responses definition
    registry.register(
      types.response,
      builders.buildResponseDefinition(contentType),
      getConfig('entitiesResponses')
    );

    registry.register(
      types.responseCollection,
      builders.buildResponseCollectionDefinition(contentType),
      getConfig('entitiesResponsesCollection')
    );

    // Query extensions
    registry.register(
      types.queries,
      builders.buildCollectionTypeQueries(contentType),
      getConfig('queries')
    );

    // Mutation extensions
    registry.register(
      types.mutations,
      builders.buildCollectionTypeMutations(contentType),
      getConfig('mutations')
    );
  };

  const registerEnumsDefinition = contentType => {
    const { attributes } = contentType;

    const enumAttributes = Object.keys(attributes).filter(attributeName =>
      utils.isEnumeration(attributes[attributeName])
    );

    for (const attributeName of enumAttributes) {
      const attribute = attributes[attributeName];

      const enumName = utils.getEnumName(contentType, attributeName);
      const enumDefinition = builders.buildEnumTypeDefinition(attribute, enumName);

      registry.register(enumName, enumDefinition, {
        kind: 'enums',
        contentType,
        attributeName,
        attribute,
      });
    }
  };

  const registerDynamicZonesDefinition = contentType => {
    const { attributes } = contentType;

    const dynamicZoneAttributes = Object.keys(attributes).filter(attributeName =>
      utils.isDynamicZone(attributes[attributeName])
    );

    for (const attributeName of dynamicZoneAttributes) {
      const attribute = attributes[attributeName];
      const dzName = utils.getDynamicZoneName(contentType, attributeName);
      const dzInputName = utils.getDynamicZoneInputName(contentType, attributeName);

      const [type, input] = builders.buildDynamicZoneDefinition(attribute, dzName, dzInputName);

      if (type && input) {
        const baseConfig = {
          contentType,
          attributeName,
          attribute,
        };

        registry.register(dzName, type, { kind: 'dynamic-zones', ...baseConfig });
        registry.register(dzInputName, input, { kind: 'inputs', ...baseConfig });
      }
    }
  };

  const registerFiltersDefinition = contentType => {
    const type = utils.getFiltersInputTypeName(contentType);
    const definition = builders.buildContentTypeFilters(contentType);

    registry.register(type, definition, { kind: 'filters-inputs', contentType });
  };

  const registerInputsDefinition = contentType => {
    const { modelType } = contentType;

    const type = (modelType === 'component'
      ? utils.getComponentInputName
      : utils.getContentTypeInputName
    ).call(null, contentType);

    const definition = builders.buildInputType(contentType);

    registry.register(type, definition, { kind: 'inputs', contentType });
  };

  return () => {
    const contentTypes = [
      ...Object.values(strapi.components),
      ...Object.values(strapi.contentTypes),
    ];

    // Register needed scalar types
    Object.entries(scalars).forEach(([name, definition]) => {
      registry.register(name, definition, { kind: 'scalar' });
    });

    // Register Strapi's internal types
    const internals = buildInternals({ strapi });

    for (const [kind, definitions] of Object.entries(internals)) {
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
