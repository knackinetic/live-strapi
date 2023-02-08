'use strict';

const { prop, isNil, isEmpty, isArray } = require('lodash/fp');

const { getService } = require('../utils');

/**
 * Adds the default locale to an object if it isn't defined yet
 * @param {Object} data a data object before being persisted into db
 */
const assignDefaultLocale = async (data) => {
  const { getDefaultLocale } = getService('locales');

  if (isArray(data) && data.some((entry) => !entry.locale)) {
    const defaultLocale = await getDefaultLocale();
    data.forEach((entry) => {
      if (isNil(entry.locale)) {
        entry.locale = defaultLocale;
      }
    });
  } else if (isNil(data.locale)) {
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

    for (const localization of entry.localizations) {
      await updateLocalization(localization.id);
    }
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

    for (const localization of entry.localizations) {
      await updateLocalization(localization.id);
    }
  }
};

module.exports = () => ({
  assignDefaultLocale,
  syncLocalizations,
  syncNonLocalizedAttributes,
});
