#!/usr/bin/env node

'use strict';

// FIXME
/* eslint-disable import/extensions */
const _ = require('lodash');
const resolveCwd = require('resolve-cwd');
const { yellow } = require('chalk');
const { Command, Option } = require('commander');

const program = new Command();

const { parseType } = require('@strapi/utils/lib');
const inquirer = require('inquirer');
const packageJSON = require('../package.json');

const checkCwdIsStrapiApp = (name) => {
  const logErrorAndExit = () => {
    console.log(
      `You need to run ${yellow(
        `strapi ${name}`
      )} in a Strapi project. Make sure you are in the right directory.`
    );
    process.exit(1);
  };

  try {
    const pkgJSON = require(`${process.cwd()}/package.json`);
    if (!_.has(pkgJSON, 'dependencies.@strapi/strapi')) {
      logErrorAndExit(name);
    }
  } catch (err) {
    logErrorAndExit(name);
  }
};

const getLocalScript =
  (name) =>
  (...args) => {
    checkCwdIsStrapiApp(name);

    const cmdPath = resolveCwd.silent(`@strapi/strapi/lib/commands/${name}`);
    if (!cmdPath) {
      console.log(
        `Error loading the local ${yellow(
          name
        )} command. Strapi might not be installed in your "node_modules". You may need to run "yarn install".`
      );
      process.exit(1);
    }

    const script = require(cmdPath);

    Promise.resolve()
      .then(() => {
        return script(...args);
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  };

// Initial program setup
program.storeOptionsAsProperties(false).allowUnknownOption(true);

program.helpOption('-h, --help', 'Display help for command');
program.addHelpCommand('help [command]', 'Display help for command');

// `$ strapi version` (--version synonym)
program.version(packageJSON.version, '-v, --version', 'Output the version number');
program
  .command('version')
  .description('Output the version of Strapi')
  .action(() => {
    process.stdout.write(`${packageJSON.version}\n`);
    process.exit(0);
  });

// `$ strapi console`
program
  .command('console')
  .description('Open the Strapi framework console')
  .action(getLocalScript('console'));

// `$ strapi new`
program
  .command('new <directory>')
  .option('--no-run', 'Do not start the application after it is created')
  .option('--use-npm', 'Force usage of npm instead of yarn to create the project')
  .option('--debug', 'Display database connection errors')
  .option('--quickstart', 'Create quickstart app')
  .option('--dbclient <dbclient>', 'Database client')
  .option('--dbhost <dbhost>', 'Database host')
  .option('--dbport <dbport>', 'Database port')
  .option('--dbname <dbname>', 'Database name')
  .option('--dbusername <dbusername>', 'Database username')
  .option('--dbpassword <dbpassword>', 'Database password')
  .option('--dbssl <dbssl>', 'Database SSL')
  .option('--dbfile <dbfile>', 'Database file path for sqlite')
  .option('--dbforce', 'Allow overwriting existing database content')
  .option('-ts, --typescript', 'Create a typescript project')
  .description('Create a new application')
  .action(require('../lib/commands/new'));

// `$ strapi start`
program
  .command('start')
  .description('Start your Strapi application')
  .action(getLocalScript('start'));

// `$ strapi develop`
program
  .command('develop')
  .alias('dev')
  .option('--no-build', 'Disable build')
  .option('--watch-admin', 'Enable watch', false)
  .option('--polling', 'Watch for file changes in network directories', false)
  .option('--browser <name>', 'Open the browser', true)
  .description('Start your Strapi application in development mode')
  .action(getLocalScript('develop'));

// $ strapi generate
program
  .command('generate')
  .description('Launch the interactive API generator')
  .action(() => {
    checkCwdIsStrapiApp('generate');
    process.argv.splice(2, 1);
    require('@strapi/generators').runCLI();
  });

// `$ strapi generate:template <directory>`
program
  .command('templates:generate <directory>')
  .description('Generate template from Strapi project')
  .action(getLocalScript('generate-template'));

program
  .command('build')
  .option('--no-optimization', 'Build the admin app without optimizing assets')
  .description('Build the strapi admin app')
  .action(getLocalScript('build'));

// `$ strapi install`
program
  .command('install [plugins...]')
  .description('Install a Strapi plugin')
  .action(getLocalScript('install'));

// `$ strapi uninstall`
program
  .command('uninstall [plugins...]')
  .description('Uninstall a Strapi plugin')
  .option('-d, --delete-files', 'Delete files', false)
  .action(getLocalScript('uninstall'));

//   `$ strapi watch-admin`
program
  .command('watch-admin')
  .option('--browser <name>', 'Open the browser', true)
  .description('Start the admin development server')
  .action(getLocalScript('watchAdmin'));

program
  .command('configuration:dump')
  .alias('config:dump')
  .description('Dump configurations of your application')
  .option('-f, --file <file>', 'Output file, default output is stdout')
  .option('-p, --pretty', 'Format the output JSON with indentation and line breaks', false)
  .action(getLocalScript('configurationDump'));

program
  .command('configuration:restore')
  .alias('config:restore')
  .description('Restore configurations of your application')
  .option('-f, --file <file>', 'Input file, default input is stdin')
  .option('-s, --strategy <strategy>', 'Strategy name, one of: "replace", "merge", "keep"')
  .action(getLocalScript('configurationRestore'));

// Admin
program
  .command('admin:create-user')
  .alias('admin:create')
  .description('Create a new admin')
  .option('-e, --email <email>', 'Email of the new admin')
  .option('-p, --password <password>', 'Password of the new admin')
  .option('-f, --firstname <first name>', 'First name of the new admin')
  .option('-l, --lastname <last name>', 'Last name of the new admin')
  .action(getLocalScript('admin-create'));

program
  .command('admin:reset-user-password')
  .alias('admin:reset-password')
  .description("Reset an admin user's password")
  .option('-e, --email <email>', 'The user email')
  .option('-p, --password <password>', 'New password for the user')
  .action(getLocalScript('admin-reset'));

program
  .command('routes:list')
  .description('List all the application routes')
  .action(getLocalScript('routes/list'));

program
  .command('middlewares:list')
  .description('List all the application middlewares')
  .action(getLocalScript('middlewares/list'));

program
  .command('policies:list')
  .description('List all the application policies')
  .action(getLocalScript('policies/list'));

program
  .command('content-types:list')
  .description('List all the application content-types')
  .action(getLocalScript('content-types/list'));

program
  .command('hooks:list')
  .description('List all the application hooks')
  .action(getLocalScript('hooks/list'));

program
  .command('services:list')
  .description('List all the application services')
  .action(getLocalScript('services/list'));

program
  .command('controllers:list')
  .description('List all the application controllers')
  .action(getLocalScript('controllers/list'));

//    `$ strapi opt-out-telemetry`
program
  .command('telemetry:disable')
  .description('Disable anonymous telemetry and metadata sending to Strapi analytics')
  .action(getLocalScript('opt-out-telemetry'));

//    `$ strapi opt-in-telemetry`
program
  .command('telemetry:enable')
  .description('Enable anonymous telemetry and metadata sending to Strapi analytics')
  .action(getLocalScript('opt-in-telemetry'));

program
  .command('ts:generate-types')
  .description(`Generate TypeScript typings for your schemas`)
  .option(
    '-o, --out-dir <outDir>',
    'Specify a relative directory in which the schemas definitions will be generated'
  )
  .option('-f, --file <file>', 'Specify a filename to store the schemas definitions')
  .option('--verbose', `Display more information about the types generation`, false)
  .option('-s, --silent', `Run the generation silently, without any output`, false)
  .action(getLocalScript('ts/generate-types'));

// `$ strapi export`
const parseBool = (arg) => {
  try {
    return parseType({ type: 'boolean', value: arg });
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};
// // Will be used for the options that accept a list
// const listOption = (value) => {
//   return value.split(',');
// };

program
  .command('export')
  .description('Export data from Strapi to file')
  .addOption(
    new Option(
      '--output <outputFilename>',
      'Filename to output (without extension) [Default: "export_{yyyymmddHHMMSS}[.tar.gz][.gpg]"]'
    )
  )
  .addOption(
    new Option('--encrypt [boolean]', 'Encrypt output file').default(true).argParser(parseBool)
  )
  .addOption(
    new Option('--compress [boolean]', 'Compress output file using gz')
      .default(true)
      .argParser(parseBool)
  )
  .addOption(new Option('--key', 'Provide encryption key in command instead of using a prompt'))
  // Options we plan to add in the future:
  // .option('--config <configFile>', 'Path to the config file')
  // .addOption(new Option('--sourceUrl', 'Remote url to use instead of local instance of Strapi'))
  // .addOption(new Option('--sourceToken', 'Auth token for remote Strapi')) // required if sourceUrl is set
  // .addOption(new Option('--archive', 'combine into one gzip file', true)) // for now we REQUIRE this to be true
  // .addOption(
  //   new Option(
  //     '--only <data,to,include>',
  //     'Comma-separated list of data to include (webhooks, content, localmedia, providermedia, config)', // ['webhooks', 'content', 'localmedia', 'providermedia', 'relations']
  //     listOption
  //   )
  // )
  // .addOption(
  //   new Option(
  //     '--exclude <data,to,exclude>',
  //     'Comma-separated list of data to exclude (webhooks,content,localmedia,providermedia,config,relations)', // ['webhooks', 'content', 'localmedia', 'providermedia', 'relations']
  //     listOption
  //   )
  // )
  // .addOption(
  //   new Option('--encryptionCipher <crypto cipher>', 'node crypto cipher to use', 'aes-256') // .choices(crypto.getCiphers())
  // )
  // .addOption(
  //   new Option('--encryptionHash <crypto hash>', 'node crypto hash to use', 'sha-256') // .choices(crypto.getHashes())
  // )
  // .addOption(
  //   new Option('--split <max MB per file>', 'split exported file when exceeding max filesize in MB')
  // )
  .hook('preAction', async (thisCommand) => {
    const opts = thisCommand.opts();

    // if encrypt is set but we have no key, prompt for it
    if (opts.encrypt && !opts.key) {
      try {
        const answers = await inquirer.prompt([
          {
            type: 'password',
            message: 'Please enter an encryption key',
            name: 'key',
            validate(key) {
              if (key.length > 0) return true;

              return 'Key must be present when using the encrypt option';
            },
          },
        ]);
        opts.key = answers.key;
      } catch (e) {
        console.error('Failed to get encryption key');
        console.error('Export process failed unexpectedly');
        process.exit(1);
      }
      if (!opts.key) {
        console.error('Failed to get encryption key');
        console.error('Export process failed unexpectedly');
        process.exit(1);
      }
    }
  })
  .action(require('../lib/commands/transfer/export'));

// `$ strapi import`
// program
//   .command('import')
//   .description('Import data from file to Strapi')
//   // TODO: Final version should be possible to provide all options on the CLI instead of config file
//   // .option('--config <configFile>', 'Path to the config file')
//   .option('--input <input filename>', 'Path to the file to be imported')
//   // .addOption(
//   //   new Option('--destinationUrl', 'Remote url to use instead of local instance of Strapi') // required if remote === true
//   // )
//   // .addOption(
//   //   new Option('--destinationToken', 'Auth token for remote Strapi') // required if remote === true
//   // )
//   // .addOption(
//   //   new Option('--destinationAllowInsecure', 'Bypass check for https on remote destination', false)
//   // )
//   // .addOption(
//   //   new Option('--conflictStrategy <conflictStrategy>', 'Which strategy to use for ID conflicts')
//   //     .choices(['restore', 'abort', 'replace', 'keep'])
//   //     .default('keep')
//   // )
//   // .addOption(
//   //   new Option(
//   //     '--only <data,to,include>',
//   //     'Comma-separated list of data to include (webhooks,content,localmedia,providermedia,config)', // ['webhooks', 'content', 'localmedia', 'providermedia', 'relations']
//   //     listOption
//   //   )
//   // )
//   // .addOption(
//   //   new Option(
//   //     '--exclude <data,to,exclude>',
//   //     'Comma-separated list of data to exclude (webhooks,content,localmedia,providermedia,config,relations)', // ['webhooks', 'content', 'localmedia', 'providermedia', 'relations']
//   //     listOption
//   //   )
//   // )
//   // .addOption(
//   //   new Option(
//   //     '--schemaComparison <schemaComparison>',
//   //     'exact requires every field to match, strict requires Strapi version and schemas to match, subset requires source schema to exist in destination, bypass skips checks'
//   //   )
//   //     .choices(['exact', 'strict', 'subset', 'bypass'])
//   //     .default('exact')
//   // )
//   // .addOption(
//   //   new Option(
//   //     '--requireEmptyDestination',
//   //     'Require the destination to not contain any entities before starting',
//   //     true
//   //   )
//   // )
//   // We do not need a compressed content option. We autodetect by "brute force"; try reading the file and within a few bytes it will fail and we try the other method
//   // .addOption(new Option('--decompress', 'decompress content', true)) // we should be able to autodetect
//   // A --decrypt option is superfluous. If user provides a password, we try it. Otherwise it fails and we notify user.
//   .addOption(new Option('-password, -p', 'prompt for password'))
//   // .addOption(
//   //   new Option(
//   //     '--encryptionCipher <crypto cipher>',
//   //     'node crypto cipher to use for decryption',
//   //     'aes-256'
//   //   ) // .choices(crypto.getCiphers())
//   // )
//   .action(require('../lib/commands/transfer/import'));

program.parseAsync(process.argv);
