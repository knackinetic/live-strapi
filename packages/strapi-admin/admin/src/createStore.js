/**
 * Common configuration for the app in both dev an prod mode
 */

import createHistory from 'history/createBrowserHistory';
import './public-path';
import configureStore from './configureStore';

const basename = strapi.remoteURL.replace(window.location.origin, '');
const history = createHistory({
  basename,
});
const store = configureStore({}, history);

export { basename, history, store };