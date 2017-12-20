import { LOCATION_CHANGE } from 'react-router-redux';
import {
  call,
  cancel,
  fork,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';

import request from 'utils/request';

import {
  downloadPluginError,
  downloadPluginSucceeded,
  getPluginsSucceeded,
} from './actions';
import { DOWNLOAD_PLUGIN, GET_PLUGINS } from './constants';
import { makeSelectPluginToDownload } from './selectors';

export function* pluginDownload() {
  try {
    const pluginToDownload = yield select(makeSelectPluginToDownload());
    const opts = {
      method: 'POST',
      body: {
        plugin: pluginToDownload,
        port: window.location.port,
      },
    };
    const response = yield call(request, '/admin/plugins/install', opts, true);

    if (response.ok) {
      yield new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 2500);
      });
      yield put(downloadPluginSucceeded());
      window.location.reload();
    }
  } catch(err) {
    yield put(downloadPluginError());
  }
}

export function* pluginsGet() {
  try {
    const opts = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const availablePlugins = yield call(request, 'https://marketplace.strapi.io/plugins', opts);
    const supportUs = {
      description: 'app.components.InstallPluginPage.plugin.support-us.description',
      id: 'support-us',
      icon: '',
      name: 'buy a t-shirt',
      price: 30,
      ratings: 5,
      isCompatible: true,
    };

    yield put(getPluginsSucceeded(availablePlugins.concat([supportUs])));
  } catch(err) {
    strapi.notification.error('notification.error');
  }
}



// Individual exports for testing
export default function* defaultSaga() {
  const loadPluginsWatcher = yield fork(takeLatest, GET_PLUGINS, pluginsGet);
  yield fork(takeLatest, DOWNLOAD_PLUGIN, pluginDownload);

  yield take(LOCATION_CHANGE);

  yield cancel(loadPluginsWatcher);
}
