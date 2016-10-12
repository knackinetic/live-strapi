/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const logger = require('../../server/logger');
const pkg = require(path.resolve(process.cwd(), 'package.json'));
const dllPlugin = pkg.dllPlugin;
const argv = require('minimist')(process.argv.slice(2));
const pluginId = pkg.name.replace(/^strapi-/i, '');
const _ = require('lodash');
// PostCSS plugins
const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');

const plugins = [
  new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
  new webpack.NoErrorsPlugin(),
];
const port = argv.port || process.env.PORT || 3000;

module.exports = require('./webpack.base.babel')({
  // Add hot reloading in development
  entry: [
    'eventsource-polyfill', // Necessary for hot reloading with IE
    `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
    path.join(process.cwd(), 'app/app.js'), // Start with js/app.js
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: `http://127.0.0.1:${port}/`,
  },

  // Add development plugins
  plugins: dependencyHandlers().concat(plugins), // eslint-disable-line no-use-before-define

  // Load the SCSS in a style tag in development
  // cssLoaders: 'style-loader!css-loader?modules&importLoaders=1&sourceMap!postcss-loader!sass-loader',
  cssLoaders: `style-loader!css-loader?localIdentName=${pluginId}[local]__[path][name]__[hash:base64:5]&modules&importLoaders=1&sourceMap!postcss-loader!sass-loader`,

  // Process the CSS with PostCSS
  postcssPlugins: [
    postcssFocus(), // Add a :focus to every :hover
    cssnext({ // Allow future CSS features to be used, also auto-prefixes the CSS...
      browsers: ['last 2 versions', 'IE > 10'], // ...based on this browser list
    }),
    postcssReporter({ // Posts messages from plugins to the terminal
      clearMessages: true,
    }),
  ],

  // Tell babel that we want to hot-reload
  babelQuery: {
    presets: ['react-hmre'],
  },

  // Emit a source map for easier debugging
  devtool: 'cheap-module-eval-source-map',

  // Generate translations files
  generateTranslationFiles: generateTranslationFiles(),
});

/**
 * Select which plugins to use to optimize the bundle's handling of
 * third party dependencies.
 *
 * If there is a dllPlugin key on the project's package.json, the
 * Webpack DLL Plugin will be used.  Otherwise the CommonsChunkPlugin
 * will be used.
 *
 */
function dependencyHandlers() {
  // Don't do anything during the DLL Build step
  if (process.env.BUILDING_DLL) {
    return [];
  }

  // If the package.json does not have a dllPlugin property, use the CommonsChunkPlugin
  if (!dllPlugin) {
    return [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        children: true,
        minChunks: 2,
        async: true,
      }),
    ];
  }

  const dllPath = path.resolve(process.cwd(), dllPlugin.path || 'node_modules/react-boilerplate-dlls');

  /**
   * If DLLs aren't explicitly defined, we assume all production dependencies listed in package.json
   * Reminder: You need to exclude any server side dependencies by listing them in dllConfig.exclude
   *
   * @see https://github.com/mxstbr/react-boilerplate/tree/master/docs/general/webpack.md
   */
  if (!dllPlugin.dlls) {
    const manifestPath = path.resolve(dllPath, 'reactBoilerplateDeps.json');

    if (!fs.existsSync(manifestPath)) {
      logger.error('The DLL manifest is missing. Please run `npm run build:dll`');
      process.exit(0);
    }

    return [
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: require(manifestPath), // eslint-disable-line global-require
      }),
    ];
  }

  // If DLLs are explicitly defined, we automatically create a DLLReferencePlugin for each of them.
  const dllManifests = Object.keys(dllPlugin.dlls).map((name) => path.join(dllPath, `/${name}.json`));

  return dllManifests.map((manifestPath) => {
    if (!fs.existsSync(path)) {
      if (!fs.existsSync(manifestPath)) {
        logger.error(`The following Webpack DLL manifest is missing: ${path.basename(manifestPath)}`);
        logger.error(`Expected to find it in ${dllPath}`);
        logger.error('Please run: npm run build:dll');

        process.exit(0);
      }
    }

    return new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(manifestPath), // eslint-disable-line global-require
    });
  });
}

/**
 * Generate translation files according
 * to `messages.json` included in the app.
 */
function generateTranslationFiles() {
  // App directory
  const appDirectory = path.resolve(process.cwd(), 'app');

  // Find `message.json` files in the app
  findMessagesFiles(appDirectory, (err, messageFiles) => {
    if (err) {
      return;
    }

    // Format messages found
    const messagesFormatted = formatMessages(messageFiles);

    // Get the list of languages supported by this plugin
    const pluginLanguages = getPluginLanguages();

    // Get current translations values
    const currentTranslationsValues = getCurrentTranslationsValues(pluginLanguages);

    // Update translations values
    const updatedTranslationValues = getUpdatedTranslationValues(currentTranslationsValues, messagesFormatted);

    // Write files according to updated translations values
    writeTranslationFiles(pluginLanguages, updatedTranslationValues);
  });
}

/**
 * Find `message.json` files in the app.
 *
 * @param cb {Function} Callback
 */
function findMessagesFiles(appDir, cb) {
  // Name of the messages files
  const messagesFileName = 'messages.json';

  // App directory
  // const dir = path.resolve(process.cwd(), 'app');

  // Results
  let results = {};

  // Parallel search
  fs.readdir(appDir, (err, list) => {
    if (err) {
      return cb(err);
    }

    let pending = list.length;
    if (!pending) {
      return cb(null, results);
    }
    return list.forEach(fileName => {
      const filePath = path.resolve(appDir, fileName);
      fs.stat(filePath, (errStat, stat) => {
        if (stat && stat.isDirectory()) {
          findMessagesFiles(filePath, (errFind, res) => {
            // Merge with the previous results
            results = _.merge(results, res);
            if (!--pending) {
              cb(null, results);
            }
          });
        } else {
          if (fileName === messagesFileName) {
            results[filePath] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          }
          if (!--pending) {
            cb(null, results);
          }
        }
      });
    });
  });
}

/**
 * Returns the list of languages supported by the plugin.
 *
 * @returns {Array} List of languages support by the plugin
 */
function getPluginLanguages() {
  return fs.readdirSync(path.resolve(process.cwd(), 'app', 'translations')).map(fileName => (fileName.replace('.json', '')));
}

/**
 * Returns the list of current translations values.
 *
 * @param languages {Array}  List of languages support by the plugin
 * @returns         {Object} Current translation values
 */
function getCurrentTranslationsValues(languages) {
  const currentTranslationsValues = {};

  _.forEach(languages, language => {
    currentTranslationsValues[language] = JSON.parse(fs.readFileSync((path.resolve(process.cwd(), 'app', 'translations', `${language}.json`)), 'utf8'));
  });

  return currentTranslationsValues;
}

/**
 * Format messages.
 *
 * @param messageFiles {Object}
 * @returns            {Object} Messages formatted
 */
function formatMessages(messageFiles) {
  const messagesFormatted = {};

  _.forEach(messageFiles, messageFile => {
    _.forEach(messageFile, message => {
      messagesFormatted[message.id] = message.defaultMessage;
    });
  });

  return messagesFormatted;
}

/**
 * Merge current translations with new ones.
 *
 * @param currentTranslationsValues {Object} Current translations value
 * @param messagesFormatted         {Object} Messages formatted from `messages.json` files
 * @returns                         {Object} Translations values updated
 */
function getUpdatedTranslationValues(currentTranslationsValues, messagesFormatted) {
  const updatedTranslationValues = {};

  _.forEach(currentTranslationsValues, (value, language) => {
    updatedTranslationValues[language] = {};

    // Sort the messages and assigns the values
    Object.keys(messagesFormatted).sort().forEach(id => {
      updatedTranslationValues[language][id] = currentTranslationsValues[language][id] || '';
    });
  });

  return updatedTranslationValues;
}

/**
 * Overwrite translations files according to updated values
 *
 * @param languages                 {Array}  The list of languages supported by the plugin
 * @param updatedTranslationValues  {Object} Translations values updated
 */
function writeTranslationFiles(languages, updatedTranslationValues) {
  _.forEach(languages, (language) => {
    fs.writeFileSync(path.resolve(path.resolve(process.cwd(), 'app', 'translations', `${language}.json`)), JSON.stringify(updatedTranslationValues[language], null, 2));
  });
}
