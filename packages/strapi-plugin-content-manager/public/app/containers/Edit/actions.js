/*
 *
 * Edit actions
 *
 */

import {
  SET_CURRENT_MODEL_NAME,
  LOAD_RECORD,
  LOAD_RECORD_SUCCESS,
  SET_RECORD_ATTRIBUTE,
  EDIT_RECORD,
  EDIT_RECORD_SUCCESS,
  EDIT_RECORD_ERROR,
} from './constants';

export function setCurrentModelName(currentModelName) {
  return {
    type: SET_CURRENT_MODEL_NAME,
    currentModelName,
  };
}

export function loadRecord(id) {
  return {
    type: LOAD_RECORD,
    id,
  };
}

export function recordLoaded(record) {
  return {
    type: LOAD_RECORD_SUCCESS,
    record,
  };
}

export function setRecordAttribute(key, value) {
  return {
    type: SET_RECORD_ATTRIBUTE,
    key,
    value,
  };
}

export function editRecord() {
  return {
    type: EDIT_RECORD,
  };
}

export function recordEdited() {
  return {
    type: EDIT_RECORD_SUCCESS,
  };
}

export function recordEditError() {
  return {
    type: EDIT_RECORD_ERROR,
  };
}
