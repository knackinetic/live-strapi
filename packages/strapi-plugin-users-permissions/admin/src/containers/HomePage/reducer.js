/*
 *
 * HomePage reducer
 *
 */

import { fromJS, List, Map } from 'immutable';

import {
  CANCEL_CHANGES,
  DELETE_DATA,
  DELETE_DATA_SUCCEEDED,
  FETCH_DATA_SUCCEEDED,
  ON_CHANGE,
  SET_DATA_TO_EDIT,
  SET_FORM,
  SUBMIT_SUCCEEDED,
  UNSET_DATA_TO_EDIT,
} from './constants';

const initialState = fromJS({
  data: List([]),
  dataToDelete: Map({}),
  dataToEdit: '',
  deleteEndPoint: '',
  initialData: fromJS({}),
  modifiedData: fromJS({}),
});

function homePageReducer(state = initialState, action) {
  switch (action.type) {
    case CANCEL_CHANGES:
      return state.update('modifiedData', () => state.get('initialData'));
    case DELETE_DATA:
      return state
        .set('dataToDelete', Map(action.dataToDelete))
        .set('deleteEndPoint', action.deleteEndPoint);
    case DELETE_DATA_SUCCEEDED:
      return state
        .update('data', list => list.splice(action.indexDataToDelete, 1))
        .set('deleteEndPoint', '')
        .set('dataToDelete', Map({}));
    case FETCH_DATA_SUCCEEDED:
      return state
        .set('data', List(action.data))
        .set('initialData', action.modifiedData)
        .set('modifiedData', action.modifiedData);
    case ON_CHANGE:
      return state
        .updateIn(action.keys, () => action.value);
    case SET_DATA_TO_EDIT:
      return state.update('dataToEdit', () => action.dataToEdit);
    case SET_FORM:
      return state
        .set('initialData', action.form)
        .set('modifiedData', action.form);
    case SUBMIT_SUCCEEDED:
      return state
        .update('dataToEdit', () => '')
        .update('initialData', () => state.get('modifiedData'));
    case UNSET_DATA_TO_EDIT:
      return state
        .update('dataToEdit', () => '')
        .update('modifiedData', () => state.get('initialData'));
    default:
      return state;
  }
}

export default homePageReducer;
