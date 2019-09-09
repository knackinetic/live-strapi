// Shared constants
import { fromJS } from 'immutable';

import {
  DISABLE_GLOBAL_OVERLAY_BLOCKER,
  ENABLE_GLOBAL_OVERLAY_BLOCKER,
  FREEZE_APP,
  GET_DATA_SUCCEEDED,
  PLUGIN_DELETED,
  PLUGIN_LOADED,
  UNFREEZE_APP,
  UNSET_HAS_USERS_PLUGIN,
  UPDATE_PLUGIN,
} from './constants';

const initialState = fromJS({
  blockApp: false,
  overlayBlockerData: null,
  hasUserPlugin: true,
  hasAdminUser: false,
  isLoading: true,
  plugins: {},
  showGlobalAppBlocker: true,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case DISABLE_GLOBAL_OVERLAY_BLOCKER:
      return state.set('showGlobalAppBlocker', false);
    case ENABLE_GLOBAL_OVERLAY_BLOCKER:
      return state.set('showGlobalAppBlocker', true);
    case FREEZE_APP:
      return state.set('blockApp', true).update('overlayBlockerData', () => {
        if (action.data) {
          return action.data;
        }

        return null;
      });
    case GET_DATA_SUCCEEDED:
      return state
        .update('isLoading', () => false)
        .update('hasAdminUser', () => action.hasAdminUser);
    case PLUGIN_LOADED:
      return state.setIn(['plugins', action.plugin.id], fromJS(action.plugin));
    case UPDATE_PLUGIN:
      return state.setIn(
        ['plugins', action.pluginId, action.updatedKey],
        fromJS(action.updatedValue)
      );
    case PLUGIN_DELETED:
      return state.deleteIn(['plugins', action.plugin]);
    case UNFREEZE_APP:
      return state.set('blockApp', false).set('overlayBlockerData', null);
    case UNSET_HAS_USERS_PLUGIN:
      return state.set('hasUserPlugin', false);
    default:
      return state;
  }
}

export default appReducer;
