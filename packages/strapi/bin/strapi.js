#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');

// Local Strapi dependencies.
const packageJSON = require('../package.json');

// Strapi utilities.
const program = require('strapi-utils').commander;

/**
 * Normalize version argument
 *
 * `$ strapi -v`
 * `$ strapi -V`
 * `$ strapi --version`
 * `$ strapi version`
 */

program.allowUnknownOption(true);

// Expose version.
program.version(packageJSON.version, '-v, --version');

// Make `-v` option case-insensitive.
process.argv = _.map(process.argv, arg => {
  return (arg === '-V') ? '-v' : arg;
});

// `$ strapi version` (--version synonym)
program
  .command('version')
  .description('output your version of Strapi')
  .action(program.versionInformation);

// `$ strapi new`
program
  .command('new')
  .description('create a new application ')
  .action(require('./strapi-new'));

// `$ strapi start`
program
  .command('start')
  .description('start your Strapi application')
  .action(require('./strapi-start'));

// `$ strapi console`
// program
//   .command('console')
//   .description('open the Strapi framework console')
//   .action(require('./strapi-console'));

// `$ strapi generate:api`
program
  .command('generate:api <id> [attributes...]')
  .option('-t, --tpl <template>', 'template name')
  .option('-a, --api <api>', 'API name to generate a sub API')
  .option('-p, --plugin <plugin>', 'plugin name to generate a sub API')
  .description('generate a basic API')
  .action((id, attributes, cliArguments) => {
    cliArguments.attributes = attributes;
    require('./strapi-generate')(id, cliArguments);
  });

// `$ strapi generate:controller`
program
  .command('generate:controller <id>')
  .option('-a, --api <api>', 'API name to generate a sub API')
  .option('-p, --plugin <api>', 'plugin name')
  .option('-t, --tpl <template>', 'template name')
  .description('generate a controller for an API')
  .action(require('./strapi-generate'));

// `$ strapi generate:model`
program
  .command('generate:model <id> [attributes...]')
  .option('-a, --api <api>', 'API name to generate a sub API')
  .option('-p, --plugin <api>', 'plugin name')
  .option('-t, --tpl <template>', 'template name')
  .description('generate a model for an API')
  .action((id, attributes, cliArguments) => {
    cliArguments.attributes = attributes;
    require('./strapi-generate')(id, cliArguments);
  });

// `$ strapi generate:policy`
program
  .command('generate:policy <id>')
  .option('-a, --api <api>', 'API name')
  .option('-p, --plugin <api>', 'plugin name')
  .description('generate a policy for an API')
  .action(require('./strapi-generate'));

// `$ strapi generate:service`
program
  .command('generate:service <id>')
  .option('-a, --api <api>', 'API name')
  .option('-p, --plugin <api>', 'plugin name')
  .option('-t, --tpl <template>', 'template name')
  .description('generate a service for an API')
  .action(require('./strapi-generate'));

// `$ strapi generate:plugin`
program
  .command('generate:plugin <id>')
    .option('-p, --plugin <plugin>', 'plugin name')
    .description('generate a basic plugin')
    .action(require('./strapi-generate'));

// `$ strapi generate:hook`
program
  .command('generate:hook <id>')
  .description('generate an installable hook')
  .action(require('./strapi-generate'));

// `$ strapi generate:generator`
program
  .command('generate:generator <id>')
  .description('generate a custom generator')
  .action(require('./strapi-generate'));

// `$ strapi migrate:make`
program
  .command('migrate:make')
  .description('make migrations for a connection')
  .action(require('./strapi-migrate-make'));

// `$ strapi migrate:run`
program
  .command('migrate:run')
  .description('run migrations for a connection')
  .action(require('./strapi-migrate-run'));

// `$ strapi migrate:rollback`
program
  .command('migrate:rollback')
  .description('rollback the latest batch of migrations for a connection')
  .action(require('./strapi-migrate-rollback'));

// `$ strapi config`
program
  .command('config')
  .description('extend the Strapi framework with custom generators')
  .action(require('./strapi-config'));

// `$ strapi update`
program
  .command('update')
  .description('pull the latest updates of your custom generators')
  .action(require('./strapi-update'));

/**
 * Normalize help argument
 */

// `$ strapi help` (--help synonym)
program
  .command('help')
  .description('output the help')
  .action(program.usageMinusWildcard);

// `$ strapi <unrecognized_cmd>`
// Mask the '*' in `help`.
program
  .command('*')
  .action(program.usageMinusWildcard);

// Don't balk at unknown options.

/**
 * `$ strapi`
 */

program.parse(process.argv);
const NO_COMMAND_SPECIFIED = program.args.length === 0;
if (NO_COMMAND_SPECIFIED) {
  program.usageMinusWildcard();
}
