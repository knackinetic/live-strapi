'use strict';

const { loadProjectScript } = require('../../utils/helpers');

module.exports = ({ command /* , argv */ }) => {
  // `$ strapi console`
  command
    .command('console')
    .description('Open the Strapi framework console')
    .action(loadProjectScript('console'));
};
