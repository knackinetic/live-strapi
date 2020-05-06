'use strict';

const fs = require('fs');
const strapi = require('../index');

const CHUNK_SIZE = 100;

/**
 * Will dump configurations to a file or stdout
 * @param {string} file filepath to use as output
 */
module.exports = async function({ file }) {
  const output = file ? fs.createWriteStream(file) : process.stdout;

  const app = strapi();

  await app.load();

  const count = await app.query('core_store').count();

  const exportData = [];

  const pageCount = Math.ceil(count / 100);

  for (let page = 0; page < pageCount; page++) {
    const results = await app
      .query('core_store')
      .find({ _limit: CHUNK_SIZE, _start: page * CHUNK_SIZE });

    results
      .filter(result => result.key.startsWith('plugin_'))
      .forEach(result => {
        exportData.push({
          key: result.key,
          value: result.value,
          type: result.type,
          environment: result.environment,
          tag: result.tag,
        });
      });
  }

  output.write(JSON.stringify(exportData));
  output.write('\n');
  output.end();

  // log success only when writting to file
  if (file) {
    console.log(`Successfully exported ${exportData.length} configuration entries`);
  }
  process.exit(0);
};
