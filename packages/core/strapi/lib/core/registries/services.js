'use strict';

const _ = require('lodash');
const { pickBy, has } = require('lodash/fp');
const { addNamespace } = require('../utils');

const contentTypesRegistry = strapi => {
  const services = {};
  const instantiatedServices = {};

  return {
    get(uid) {
      if (instantiatedServices[uid]) {
        return instantiatedServices[uid];
      }

      const service = services[uid];
      if (service) {
        instantiatedServices[uid] = service({ strapi });
        return instantiatedServices[uid];
      }

      return undefined;
    },
    getAll(prefix = '') {
      const filteredServices = pickBy((service, serviceUID) => serviceUID.startsWith(prefix))(
        services
      );
      return _.mapValues(filteredServices, (service, serviceUID) => this.get(serviceUID));
    },
    add(namespace, newServices) {
      for (const serviceName in newServices) {
        const service = newServices[serviceName];
        const uid = addNamespace(serviceName, namespace);

        if (has(uid, services)) {
          throw new Error(`Service ${uid} has already been registered.`);
        }
        services[uid] = service;
      }
    },
  };
};

module.exports = contentTypesRegistry;
