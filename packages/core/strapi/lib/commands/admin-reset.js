'use strict';

const _ = require('lodash');
const inquirer = require('inquirer');
const tsUtils = require('@strapi/typescript-utils');
const strapi = require('../index');

const promptQuestions = [
  { type: 'input', name: 'email', message: 'User email?' },
  { type: 'password', name: 'password', message: 'New password?' },
  {
    type: 'confirm',
    name: 'confirm',
    message: "Do you really want to reset this user's password?",
  },
];

/**
 * Reset user's password
 * @param {Object} cmdOptions - command options
 * @param {string} cmdOptions.email - user's email
 * @param {string} cmdOptions.password - user's new password
 */
module.exports = async function(cmdOptions = {}) {
  const { email, password } = cmdOptions;

  if (_.isEmpty(email) && _.isEmpty(password) && process.stdin.isTTY) {
    const inquiry = await inquirer.prompt(promptQuestions);

    if (!inquiry.confirm) {
      process.exit(0);
    }

    return changePassword(inquiry);
  }

  if (_.isEmpty(email) || _.isEmpty(password)) {
    console.error('Missing required options `email` or `password`');
    process.exit(1);
  }

  return changePassword({ email, password });
};

async function changePassword({ email, password }) {
  const appDir = process.cwd();

  const isTSProject = await tsUtils.isUsingTypeScript(appDir);
  const compiledDirectoryPath = isTSProject ? tsUtils.resolveConfigOptions(`${appDir}/tsconfig.json`).options?.outDir : null

  if (isTSProject)
    await tsUtils.compile(appDir, {
      watch: false,
      configOptions: { options: { incremental: true } },
    });

  const distDir = isTSProject ? compiledDirectoryPath : appDir;

  const app = await strapi({ appDir, distDir }).load();

  await app.admin.services.user.resetPasswordByEmail(email, password);

  console.log(`Successfully reset user's password`);
  process.exit(0);
}
