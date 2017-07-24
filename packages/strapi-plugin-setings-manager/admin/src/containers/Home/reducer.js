/*
 *
 * Home reducer
 *
 */

import { fromJS, Map, OrderedMap } from 'immutable';
import {
  CONFIG_FETCH_SUCCEEDED,
  CHANGE_INPUT,
  CANCEL_CHANGES,
  LANGUAGES_FETCH_SUCCEEDED,
  EDIT_SETTINGS_SUCCEEDED,
} from './constants';

/* eslint-disable new-cap */
const initialState = fromJS({
  loading: true,
  configsDisplay: OrderedMap(),
  initialData: Map(),
  modifiedData: Map(),
  listLanguages: Map(),
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CONFIG_FETCH_SUCCEEDED:
      return state
        .set('loading', false)
        .set('configsDisplay', OrderedMap(action.configs))
        .set('initialData', Map(action.data))
        .set('modifiedData', Map(action.data));
    case CHANGE_INPUT:
      return state.updateIn(['modifiedData', action.key], () => action.value);
    case CANCEL_CHANGES:
      return state.set('modifiedData', state.get('initialData'));
    case LANGUAGES_FETCH_SUCCEEDED:
      return state
        .set('loading', false)
        .set('configsDisplay', OrderedMap(action.configs))
        .set('initialData', Map())
        .set('modifiedData', Map())
        .set('listLanguages', Map(action.listLanguages));
    case EDIT_SETTINGS_SUCCEEDED:
      return state
        .set('configsDisplay', OrderedMap(action.optimisticResponse))
        .set('initialData', Map(action.data))
        .set('modifiedData', Map(action.data));
    default:
      return state;
  }
}

export default homeReducer;
