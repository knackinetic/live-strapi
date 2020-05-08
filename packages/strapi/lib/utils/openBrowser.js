/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var execSync = require('child_process').execSync;
var chalk = require('chalk');
var spawn = require('cross-spawn');
var opn = require('opn');
const fetch = require('node-fetch');

// https://github.com/sindresorhus/opn#app
var OSX_CHROME = 'google chrome';

const Actions = Object.freeze({
  NONE: 0,
  BROWSER: 1,
  SCRIPT: 2,
});

function getBrowserEnv() {
  // Attempt to honor this environment variable.
  // It is specific to the operating system.
  // See https://github.com/sindresorhus/opn#app for documentation.
  const value = process.env.BROWSER;
  let action;
  if (!value) {
    // Default.
    action = Actions.BROWSER;
  } else if (value.toLowerCase().endsWith('.js')) {
    action = Actions.SCRIPT;
  } else if (value.toLowerCase() === 'none') {
    action = Actions.NONE;
  } else {
    action = Actions.BROWSER;
  }
  return { action, value };
}

function executeNodeScript(scriptPath, url) {
  const extraArgs = process.argv.slice(2);
  const child = spawn('node', [scriptPath, ...extraArgs, url], {
    stdio: 'inherit',
  });
  child.on('close', code => {
    if (code !== 0) {
      console.log();
      console.log(chalk.red('The script specified as BROWSER environment variable failed.'));
      console.log(`${chalk.cyan(scriptPath)} exited with code ${code}.`);
      console.log();
      return;
    }
  });
  return true;
}

function startBrowserProcess(browser, url) {
  // If we're on OS X, the user hasn't specifically
  // requested a different browser, we can try opening
  // Chrome with AppleScript. This lets us reuse an
  // existing tab when possible instead of creating a new one.
  const shouldTryOpenChromeWithAppleScript =
    process.platform === 'darwin' && (typeof browser !== 'string' || browser === OSX_CHROME);

  if (shouldTryOpenChromeWithAppleScript) {
    try {
      // Try our best to reuse existing tab
      // on OS X Google Chrome with AppleScript
      execSync('ps cax | grep "Google Chrome"');
      execSync(`osascript resources/openChrome.applescript "${encodeURI(url)}"`, {
        cwd: __dirname,
        stdio: 'ignore',
      });
      return true;
    } catch (err) {
      strapi.log.error('Failed to open Google Chrome with AppleScript');
    }
  }

  // Another special case: on OS X, check if BROWSER has been set to "open".
  // In this case, instead of passing `open` to `opn` (which won't work),
  // just ignore it (thus ensuring the intended behavior, i.e. opening the system browser):
  // https://github.com/facebook/create-react-app/pull/1690#issuecomment-283518768
  if (process.platform === 'darwin' && browser === 'open') {
    browser = undefined;
  }

  // Fallback to opn
  // (It will always open new tab)
  try {
    var options = { app: browser };
    opn(url, options).catch(() => {}); // Prevent `unhandledRejection` error.
    return true;
  } catch (err) {
    return false;
  }
}

async function pingDashboard(url, multipleTime = false) {
  try {
    await fetch(url, { method: 'HEAD', timeout: 300, body: null });
    // Inform the user that we're going to open the administration panel.
    this.log.info('⏳ Opening the admin panel...');
  } catch (e) {
    if (e.code !== 'ECONNREFUSED' && e.type !== 'request-timeout') {
      return console.error(e);
    }

    // Only display once.
    if (!multipleTime) {
      this.log.warn(`⚠️  The admin panel is unavailable... Impossible to open it in the browser.`);
    }
  }
}

/**
 * Reads the BROWSER evironment variable and decides what to do with it. Returns
 * true if it opened a browser or ran a node.js script, otherwise false.
 */
async function openBrowser() {
  let url = this.config.admin.url;
  if (!url.startsWith('http')) {
    url = `http://${strapi.config.host}:${strapi.config.port}${this.config.admin.url}`;
  }

  // Ping the dashboard to ensure it's available.
  await pingDashboard.call(this, url);

  const { action, value } = getBrowserEnv();
  switch (action) {
    case Actions.NONE:
      // Special case: BROWSER="none" will prevent opening completely.
      return false;
    case Actions.SCRIPT:
      return executeNodeScript(value, url);
    case Actions.BROWSER:
      return startBrowserProcess(value, url);
    default:
      throw new Error('Not implemented.');
  }
}

module.exports = openBrowser;
