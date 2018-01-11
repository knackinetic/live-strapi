'use strict';

// Node.js core.
const execSync = require('child_process').execSync;
const path = require('path');

// Logger.
const logger = require('strapi-utils').logger;

module.exports = (scope, success, error) => {
  const knex  = require(path.resolve(`${scope.rootPath}/node_modules/knex`))({
    client: scope.client.module,
    connection: Object.assign(scope.database, {
      user: scope.database.username
    })
  });

  knex.raw('select 1+1 as result').then(() => {
    logger.info('The app has been connected to the database successfully');
    knex.destroy();
    execSync(`rm -r ${scope.rootPath}`);

    logger.info('Copying the dashboard...');

    success();
  })
  .catch(() => {
    logger.warn('Database connection has failed! Make sure your database is running.');
    error();
  });
};
