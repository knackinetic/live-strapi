'use strict';

const contentTypes = require('./mock-content-types');

module.exports = {
  contentTypes,
  components: {
    'basic.simple': {
      collectionName: 'components_basic_simples',
      info: { displayName: 'simple', icon: 'ambulance', description: '' },
      options: {},
      attributes: { name: { type: 'string', required: true }, test: { type: 'string' } },
      uid: 'basic.simple',
      category: 'basic',
      modelType: 'component',
      modelName: 'simple',
      globalId: 'ComponentBasicSimple',
    },
    'blog.test-como': {
      collectionName: 'components_blog_test_comos',
      info: { displayName: 'test comp', icon: 'air-freshener', description: '' },
      options: {},
      attributes: { name: { type: 'string', default: 'toto' } },
      uid: 'blog.test-como',
      category: 'blog',
      modelType: 'component',
      modelName: 'test-como',
      globalId: 'ComponentBlogTestComo',
    },
    'basic.relation': {
      collectionName: 'components_basic_relations',
      info: { displayName: 'Relation' },
      options: {},
      attributes: {
        categories: { type: 'relation', relation: 'oneToMany', target: 'api::category.category' },
      },
      uid: 'basic.relation',
      category: 'basic',
      modelType: 'component',
      modelName: 'relation',
      globalId: 'ComponentBasicRelation',
    },
  },
  plugins: {
    upload: {
      contentTypes: {
        file: contentTypes['plugin::upload.file'],
        folder: contentTypes['plugin::upload.folder'],
      },
      routes: {
        'content-api': {
          type: 'content-api',
          routes: [
            {
              method: 'POST',
              path: '/',
              handler: 'content-api.upload',
              config: { auth: { scope: ['plugin::upload.content-api.upload'] } },
              info: { pluginName: 'upload', type: 'content-api' },
            },
            {
              method: 'GET',
              path: '/files',
              handler: 'content-api.find',
              config: { auth: { scope: ['plugin::upload.content-api.find'] } },
              info: { pluginName: 'upload', type: 'content-api' },
            },
            {
              method: 'GET',
              path: '/files/:id',
              handler: 'content-api.findOne',
              config: { auth: { scope: ['plugin::upload.content-api.findOne'] } },
              info: { pluginName: 'upload', type: 'content-api' },
            },
            {
              method: 'DELETE',
              path: '/files/:id',
              handler: 'content-api.destroy',
              config: { auth: { scope: ['plugin::upload.content-api.destroy'] } },
              info: { pluginName: 'upload', type: 'content-api' },
            },
          ],
          prefix: '/upload',
        },
      },
    },
    email: {
      contentTypes: {},
    },
    'users-permissions': {
      contentTypes: {},
    },
  },
  api: {
    kitchensink: {
      contentTypes: {
        kitchensink: contentTypes['api::kitchensink.kitchensink'],
      },
      routes: {
        kitchensink: {
          routes: [
            {
              method: 'GET',
              path: '/kitchensinks',
              handler: 'api::kitchensink.kitchensink.find',
              config: { auth: { scope: ['api::kitchensink.kitchensink.find'] } },
              info: { apiName: 'kitchensink', type: 'content-api' },
            },
            {
              method: 'GET',
              path: '/kitchensinks/:id',
              handler: 'api::kitchensink.kitchensink.findOne',
              config: { auth: { scope: ['api::kitchensink.kitchensink.findOne'] } },
              info: { apiName: 'kitchensink', type: 'content-api' },
            },
            {
              method: 'POST',
              path: '/kitchensinks',
              handler: 'api::kitchensink.kitchensink.create',
              config: { auth: { scope: ['api::kitchensink.kitchensink.create'] } },
              info: { apiName: 'kitchensink', type: 'content-api' },
            },
            {
              method: 'PUT',
              path: '/kitchensinks/:id',
              handler: 'api::kitchensink.kitchensink.update',
              config: { auth: { scope: ['api::kitchensink.kitchensink.update'] } },
              info: { apiName: 'kitchensink', type: 'content-api' },
            },
            {
              method: 'DELETE',
              path: '/kitchensinks/:id',
              handler: 'api::kitchensink.kitchensink.delete',
              config: { auth: { scope: ['api::kitchensink.kitchensink.delete'] } },
              info: { apiName: 'kitchensink', type: 'content-api' },
            },
          ],
          type: 'content-api',
        },
      },
    },
  },
};
