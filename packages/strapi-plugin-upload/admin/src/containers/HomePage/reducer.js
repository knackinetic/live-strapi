/*
 *
 * HomePage reducer
 *
 */

import { fromJS, List } from 'immutable';

import {
  DROP_SUCCESS,
  ON_SEARCH,
} from './constants';

const initialState = fromJS({
  search: '',
  uploadedFiles: List([]),
});

function homePageReducer(state = initialState, action) {
  switch (action.type) {
    case DROP_SUCCESS:
      return state
        .update('uploadedFiles', (list) => List(action.newFiles).concat(list));
    case ON_SEARCH:
      return state.update('search', () => action.value);
    default:
      return state;
  }
}

export default homePageReducer;
