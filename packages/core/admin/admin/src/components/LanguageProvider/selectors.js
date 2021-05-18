import { createSelector } from 'reselect';

/**
 * Direct selector to the languageToggle state domain
 */
const selectLanguage = () => state => state.language;

/**
 * Select the language locale
 */

const selectLocale = () => createSelector(selectLanguage(), languageState => languageState.locale);

const makeSelectLocale = () => createSelector(selectLocale(), locale => ({ locale }));

export default makeSelectLocale;
export { selectLanguage, selectLocale };
