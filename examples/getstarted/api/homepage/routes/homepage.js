'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/homepage',
      handler: 'homepage.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/homepage',
      handler: 'homepage.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/homepage',
      handler: 'homepage.delete',
      config: {
        policies: [],
      },
    },
  ],
};
