/*
 *
 * App actions
 *
 */
import { pick, set } from 'lodash';
import {
  GET_DATA,
  GET_DATA_SUCCEEDED,
  DELETE_MODEL,
  DELETE_MODEL_SUCCEEDED,
  ON_CHANGE_NEW_CONTENT_TYPE,
} from './constants';

export function getData() {
  return {
    type: GET_DATA,
  };
}

export function getDataSucceeded({ allModels, models }, connections) {
  const initialData = allModels.reduce((acc, current) => {
    acc[current.name] = pick(current, ['name', 'collectionName', 'connection', 'description', 'mainField']);
    const attributes = buildModelAttributes(current.attributes);
    set(acc, [current.name, 'attributes'], attributes);

    return acc;
  }, {});

  return {
    type: GET_DATA_SUCCEEDED,
    initialData,
    models,
    connections,
  };
}

export function deleteModel(modelName) {
  return {
    type: DELETE_MODEL,
    modelName,
  };
}

export function deleteModelSucceeded(modelName) {
  return {
    type: DELETE_MODEL_SUCCEEDED,
    modelName,
  };
}

export function onChangeNewContentType({ target }) {
  return {
    type: ON_CHANGE_NEW_CONTENT_TYPE,
    keys: target.name.split('.'),
    value: target.value,
  };
}

// utils
export const buildModelAttributes = (attributes) => {
  const formattedAttributes = attributes.reduce((acc, current) => {
    acc[current.name] = current.params;

    return acc;
  }, {});

  return formattedAttributes;
};
