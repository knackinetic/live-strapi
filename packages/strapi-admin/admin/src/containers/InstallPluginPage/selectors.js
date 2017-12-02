import { createSelector } from 'reselect';

/**
 * Direct selector to the installPluginPage state domain
 */
const selectInstallPluginPageDomain = () => (state) => state.get('installPluginPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by InstallPluginPage
 */

const makeSelectInstallPluginPage = () => createSelector(
  selectInstallPluginPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectInstallPluginPage;
export {
  selectInstallPluginPageDomain,
};
