/**
 * Common configuration for the app in both dev an prod mode
 */

import { merge } from 'lodash';
import {
  freezeApp,
  pluginLoaded,
  unfreezeApp,
  updatePlugin,
} from './containers/App/actions';
import { showNotification } from './containers/NotificationProvider/actions';
import injectReducer from './utils/injectReducer';
import injectSaga from './utils/injectSaga';
// import { history, store } from './createStore';
import { translationMessages, languages } from './i18n';
// import './public-path';

/**
 * Register a plugin
 *
 * @param params
 */
const registerPlugin = plugin => {
  // Merge admin translation messages
  merge(translationMessages, plugin.translationMessages);

  plugin.leftMenuSections = plugin.leftMenuSections || [];

  store.dispatch(pluginLoaded(plugin));
};
const displayNotification = (message, status) => {
  store.dispatch(showNotification(message, status));
};
const lockApp = data => {
  store.dispatch(freezeApp(data));
};
const unlockApp = () => {
  store.dispatch(unfreezeApp());
};

window.strapi = Object.assign(window.strapi || {}, {
  node: process.env.MODE || 'host',
  registerPlugin,
  notification: {
    success: message => {
      displayNotification(message, 'success');
    },
    warning: message => {
      displayNotification(message, 'warning');
    },
    error: message => {
      displayNotification(message, 'error');
    },
    info: message => {
      displayNotification(message, 'info');
    },
  },
  refresh: pluginId => ({
    translationMessages: translationMessagesUpdated => {
      render(merge({}, translationMessages, translationMessagesUpdated));
    },
    leftMenuSections: leftMenuSectionsUpdated => {
      store.dispatch(
        updatePlugin(pluginId, 'leftMenuSections', leftMenuSectionsUpdated),
      );
    },
  }),
  router: history,
  languages,
  currentLanguage:
    window.localStorage.getItem('strapi-admin-language') ||
    window.navigator.language ||
    window.navigator.userLanguage ||
    'en',
  lockApp,
  unlockApp,
  injectReducer,
  injectSaga,
  store,
});
