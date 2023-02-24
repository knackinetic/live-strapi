'use strict';

const { pick, isEqual } = require('lodash/fp');

const { readLicense, verifyLicense, fetchLicense, LicenseCheckError } = require('./license');
const { eeStoreModel } = require('./ee-store');
const { shiftCronExpression } = require('../lib/utils/cron');

const ONE_MINUTE = 1 * 60;

const ee = {
  enabled: false,
  licenseInfo: {},
};

const disable = (message) => {
  // Prevent emitting ee.disable if it was already disabled
  const shouldEmitEvent = ee.enabled !== false;

  ee.logger?.warn(`${message} Switching to CE.`);
  // Only keep the license key for potential re-enabling during a later check
  ee.licenseInfo = pick('licenseKey', ee.licenseInfo);

  // Prevent emitting ee.disable if it was already disabled
  console.log('disabling EE');
  ee.enabled = false;

  if (shouldEmitEvent) {
    // Notify EE features that they should be disabled
    strapi.eventHub.emit('ee.disable');
  }
};

const enable = () => {
  // Prevent emitting ee.disable if it was already disabled
  const shouldEmitEvent = ee.enabled !== true;

  ee.enabled = true;

  if (shouldEmitEvent) {
    // Notify EE features that they should be disabled
    strapi.eventHub.emit('ee.enable');
  }
};

let initialized = false;

/**
 * Optimistically enable EE if the format of the license is valid, only run once.
 */
const init = (licenseDir, logger) => {
  if (initialized) {
    return;
  }

  initialized = true;
  ee.logger = logger;

  if (process.env.STRAPI_DISABLE_EE?.toLowerCase() === 'true') {
    return;
  }

  try {
    const license = process.env.STRAPI_LICENSE || readLicense(licenseDir);

    if (license) {
      ee.licenseInfo = verifyLicense(license);
      enable();
    }
  } catch (error) {
    disable(error.message);
  }
};

/**
 * Contact the license registry to update the license to its latest state.
 *
 * Store the result in database to avoid unecessary requests, and will fallback to that in case of a network failure.
 */
const onlineUpdate = async ({ strapi }) => {
  console.log('onlineUpdate');
  const { get, commit, rollback } = await strapi.db.transaction();
  const transaction = get();

  try {
    const storedInfo = await strapi.db
      .queryBuilder(eeStoreModel.uid)
      .where({ key: 'ee_information' })
      .select('value')
      .first()
      .transacting(transaction)
      .forUpdate()
      .execute()
      .then((result) => (result ? JSON.parse(result.value) : result));

    const shouldContactRegistry = (storedInfo?.lastCheckAt ?? 0) < Date.now() - ONE_MINUTE;
    const result = { lastCheckAt: Date.now() };

    const fallback = (error) => {
      if (error instanceof LicenseCheckError && error.shouldFallback && storedInfo?.license) {
        ee.logger?.warn(
          `${error.message} The last stored one will be used as a potential fallback.`
        );
        return storedInfo.license;
      }

      result.error = error.message;
      disable(error.message);
    };

    const license = shouldContactRegistry
      ? await fetchLicense(ee.licenseInfo.licenseKey, strapi.config.get('uuid')).catch(fallback)
      : storedInfo.license;

    if (license) {
      try {
        // Verify license and check if its info changed
        const newLicenseInfo = verifyLicense(license);
        const fieldsToCompare = ['licenseKey', 'features', 'plan'];
        const licenseInfoChanged = !isEqual(
          pick(fieldsToCompare, newLicenseInfo),
          pick(fieldsToCompare, ee.licenseInfo)
        );

        // Store the new license info
        ee.licenseInfo = newLicenseInfo;
        validateInfo();

        // Notify EE features
        if (licenseInfoChanged) {
          strapi.eventHub.emit('ee.update');
        }
      } catch (error) {
        disable(error.message);
      }
    } else if (!shouldContactRegistry) {
      disable(storedInfo.error);
    }

    if (shouldContactRegistry) {
      result.license = license ?? null;
      const query = strapi.db.queryBuilder(eeStoreModel.uid).transacting(transaction);

      if (!storedInfo) {
        query.insert({ key: 'ee_information', value: JSON.stringify(result) });
      } else {
        query.update({ value: JSON.stringify(result) }).where({ key: 'ee_information' });
      }

      await query.execute();
    }

    await commit();
  } catch (error) {
    // Example of errors: SQLite does not support FOR UPDATE
    await rollback();
  }
};

const validateInfo = () => {
  const expirationTime = new Date(ee.licenseInfo.expireAt).getTime();

  if (expirationTime < new Date().getTime()) {
    return disable('License expired.');
  }

  // Prevent emitting ee.enable if it was already enabled
  enable();
};

const checkLicense = async ({ strapi }) => {
  const shouldStayOffline =
    ee.licenseInfo.type === 'gold' &&
    // This env variable support is temporarily used to ease the migration between online vs offline
    process.env.STRAPI_DISABLE_LICENSE_PING?.toLowerCase() === 'true';

  if (!shouldStayOffline) {
    await onlineUpdate({ strapi });

    // strapi.cron.add({ [shiftCronExpression('0 0 */12 * * *')]: onlineUpdate });
    strapi.cron.add({ [shiftCronExpression('*/10 * * * * *')]: onlineUpdate });
  } else {
    if (!ee.licenseInfo.expireAt) {
      return disable('Your license does not have offline support.');
    }

    validateInfo();
  }
};

const list = () => {
  return (
    ee.licenseInfo.features?.map((feature) =>
      typeof feature === 'object' ? feature : { name: feature }
    ) || []
  );
};

const get = (featureName) => list().find((feature) => feature.name === featureName);

module.exports = Object.freeze({
  init,
  checkLicense,

  get isEE() {
    return ee.enabled;
  },

  features: Object.freeze({
    list,
    get,
    isEnabled: (featureName) => get(featureName) !== undefined,
  }),
});
