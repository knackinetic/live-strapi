/*
 *
 * App reducer
 *
 */

import { fromJS, List, Map } from 'immutable';
import {
  ADD_ATTRIBUTE_TO_TEMP_CONTENT_TYPE,
  CANCEL_NEW_CONTENT_TYPE,
  CLEAR_TEMPORARY_ATTRIBUTE,
  CREATE_TEMP_CONTENT_TYPE,
  DELETE_MODEL_SUCCEEDED,
  GET_DATA_SUCCEEDED,
  ON_CHANGE_NEW_CONTENT_TYPE,
  ON_CREATE_ATTRIBUTE,
} from './constants';

export const initialState = fromJS({
  connections: List([]),
  initialData: {},
  isLoading: true,
  models: List([]),
  modifiedData: {},
  newContentType: {
    collectionName: '',
    connection: '',
    description: '',
    mainField: '',
    name: '',
    attributes: {},
  },
  temporaryAttribute: {},
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ATTRIBUTE_TO_TEMP_CONTENT_TYPE: {
      return state
        .updateIn([
          'newContentType',
          'attributes',
          state.getIn(['temporaryAttribute', 'name']),
        ], () => {
          const temporaryAttributeType = state.getIn(['temporaryAttribute', 'type']);
          const type = type === 'number' && !!temporaryAttributeType ? 'integer' : action.attributeType;
          const newAttribute = state
            .get('temporaryAttribute')
            .remove('name')
            .setIn(['temporaryAttribute', 'type'], type);

          return newAttribute;
        })
        .update('temporaryAttribute', () => Map({}));
    }
    case CANCEL_NEW_CONTENT_TYPE:
      return state
        .update('newContentType', () => Map(initialState.get('newContentType')));
    case CLEAR_TEMPORARY_ATTRIBUTE:
      return state.update('temporaryAttribute', () => Map({}));
    case CREATE_TEMP_CONTENT_TYPE:
      return state
        .update('models', list => list.push({
          icon: 'fa-cube',
          name: state.getIn(['newContentType', 'name']),
          description: state.getIn(['newContentType', 'description']),
          fields: 0,
          isTemporary: true,
        }));
    case DELETE_MODEL_SUCCEEDED:
      return state
        .removeIn(['models', state.get('models').findIndex(model => model.name === action.modelName)])
        .removeIn(['initialData', action.modelName])
        .removeIn(['modifiedData', action.modelName]);
    case GET_DATA_SUCCEEDED:
      return state
        .update('connections', () => List(action.connections))
        .update('initialData', () => action.initialData)
        .update('isLoading', () => false)
        .update('modifiedData', () => action.initialData)
        .updateIn(['newContentType', 'connection'], () => action.connections[0])
        .update('models', () => List(action.models));
    case ON_CHANGE_NEW_CONTENT_TYPE:
      return state
        .updateIn(['newContentType', ...action.keys], () => action.value);
    case ON_CREATE_ATTRIBUTE:
      return state
        .updateIn(['temporaryAttribute', ...action.keys], () => action.value);
    default:
      return state;
  }
}

export default appReducer;
