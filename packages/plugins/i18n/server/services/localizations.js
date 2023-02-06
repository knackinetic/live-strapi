'use strict';

const { prop, isNil, isEmpty } = require('lodash/fp');

const { forEachAsync } = require('@strapi/utils');
const { getService } = require('../utils');

const isDialectMySQL = () => strapi.db.dialect.client === 'mysql';

/**
 * Adds the default locale to an object if it isn't defined yet
 * @param {Object} data a data object before being persisted into db
 */
const assignDefaultLocale = async (data) => {
  const { getDefaultLocale } = getService('locales');

  if (isNil(data.locale)) {
    data.locale = await getDefaultLocale();
  }
};

/**
 * Synchronize related localizations from a root one
 * @param {Object} entry entry to update
 * @param {Object} options
 * @param {Object} options.model corresponding model
 */
const syncLocalizations = async (entry, { model }) => {
  if (Array.isArray(entry.localizations)) {
    const newLocalizations = [entry.id, ...entry.localizations.map(prop('id'))];

    const updateLocalization = (id) => {
      const localizations = newLocalizations.filter((localizationId) => localizationId !== id);

      return strapi.query(model.uid).update({ where: { id }, data: { localizations } });
    };

    // MySQL/MariaDB can cause deadlocks here if concurrency higher than 1
    await forEachAsync(entry.localizations, (localization) => updateLocalization(localization.id), {
      concurrency: isDialectMySQL() ? 1 : undefined,
    });
  }
};

/**
 * Update non localized fields of all the related localizations of an entry with the entry values
 * @param {Object} entry entry to update
 * @param {Object} options
 * @param {Object} options.model corresponding model
 */
const syncNonLocalizedAttributes = async (entry, { model }) => {
  const { copyNonLocalizedAttributes } = getService('content-types');

  if (Array.isArray(entry.localizations)) {
    const nonLocalizedAttributes = copyNonLocalizedAttributes(model, entry);

    if (isEmpty(nonLocalizedAttributes)) {
      return;
    }

    const updateLocalization = (id) => {
      return strapi.entityService.update(model.uid, id, { data: nonLocalizedAttributes });
    };

    // MySQL/MariaDB can cause deadlocks here if concurrency higher than 1
    await forEachAsync(entry.localizations, (localization) => updateLocalization(localization.id), {
      concurrency: isDialectMySQL() ? 1 : undefined,
    });
  }
};

module.exports = () => ({
  assignDefaultLocale,
  syncLocalizations,
  syncNonLocalizedAttributes,
});
