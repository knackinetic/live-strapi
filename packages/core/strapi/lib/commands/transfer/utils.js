'use strict';

const chalk = require('chalk');
const Table = require('cli-table3');
const { Option } = require('commander');
const { TransferGroupPresets } = require('@strapi/data-transfer/lib/engine');
const { readableBytes, exitWith } = require('../utils/helpers');
const strapi = require('../../index');
const { getParseListWithChoices } = require('../utils/commander');

const pad = (n) => {
  return (n < 10 ? '0' : '') + String(n);
};

const yyyymmddHHMMSS = () => {
  const date = new Date();

  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};

const getDefaultExportName = () => {
  return `export_${yyyymmddHHMMSS()}`;
};

const buildTransferTable = (resultData) => {
  // Build pretty table
  const table = new Table({
    head: ['Type', 'Count', 'Size'].map((text) => chalk.bold.blue(text)),
  });

  let totalBytes = 0;
  let totalItems = 0;
  Object.keys(resultData).forEach((key) => {
    const item = resultData[key];

    table.push([
      { hAlign: 'left', content: chalk.bold(key) },
      { hAlign: 'right', content: item.count },
      { hAlign: 'right', content: `${readableBytes(item.bytes, 1, 11)} ` },
    ]);
    totalBytes += item.bytes;
    totalItems += item.count;

    if (item.aggregates) {
      Object.keys(item.aggregates)
        .sort()
        .forEach((subkey) => {
          const subitem = item.aggregates[subkey];

          table.push([
            { hAlign: 'left', content: `-- ${chalk.bold.grey(subkey)}` },
            { hAlign: 'right', content: chalk.grey(subitem.count) },
            { hAlign: 'right', content: chalk.grey(`(${readableBytes(subitem.bytes, 1, 11)})`) },
          ]);
        });
    }
  });
  table.push([
    { hAlign: 'left', content: chalk.bold.green('Total') },
    { hAlign: 'right', content: chalk.bold.green(totalItems) },
    { hAlign: 'right', content: `${chalk.bold.green(readableBytes(totalBytes, 1, 11))} ` },
  ]);

  return table;
};

const DEFAULT_IGNORED_CONTENT_TYPES = [
  'admin::permission',
  'admin::user',
  'admin::role',
  'admin::api-token',
  'admin::api-token-permission',
];

const createStrapiInstance = async (logLevel = 'error') => {
  const appContext = await strapi.compile();
  const app = strapi(appContext);

  app.log.level = logLevel;

  return app.load();
};

const transferDataTypes = Object.keys(TransferGroupPresets);

const excludeOption = new Option(
  '--exclude <comma-separated data types>',
  `Exclude this data. Options used here override --only. Available types: ${transferDataTypes.join(
    ','
  )}`
).argParser(getParseListWithChoices(transferDataTypes, 'Invalid options for "exclude"'));

const onlyOption = new Option(
  '--only <command-separated data types>',
  `Include only this data. Available types: ${transferDataTypes.join(',')}`
).argParser(getParseListWithChoices(transferDataTypes, 'Invalid options for "only"'));

const validateExcludeOnly = (command) => {
  const { exclude, only } = command.opts();
  if (!only || !exclude) {
    return;
  }

  const choicesInBoth = only.filter((n) => {
    return exclude.indexOf(n) !== -1;
  });
  if (choicesInBoth.length > 0) {
    exitWith(
      1,
      `Data types may not be used in both "exclude" and "only" in the same command. Found in both: ${choicesInBoth.join(
        ','
      )}`
    );
  }
};

module.exports = {
  buildTransferTable,
  getDefaultExportName,
  DEFAULT_IGNORED_CONTENT_TYPES,
  createStrapiInstance,
  excludeOption,
  onlyOption,
  validateExcludeOnly,
};
