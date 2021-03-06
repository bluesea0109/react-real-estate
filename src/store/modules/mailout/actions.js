import { createAction, createErrorAction } from '../../utils/helpers';

export const GET_MAILOUT_PENDING = 'GET_MAILOUT_PENDING';
export const GET_MAILOUT_SUCCESS = 'GET_MAILOUT_SUCCESS';
export const GET_MAILOUT_ERROR = 'GET_MAILOUT_ERROR';

export const SUBMIT_MAILOUT_PENDING = 'SUBMIT_MAILOUT_PENDING';
export const SUBMIT_MAILOUT_SUCCESS = 'SUBMIT_MAILOUT_SUCCESS';
export const SUBMIT_MAILOUT_ERROR = 'SUBMIT_MAILOUT_ERROR';

export const STOP_MAILOUT_PENDING = 'STOP_MAILOUT_PENDING';
export const STOP_MAILOUT_SUCCESS = 'STOP_MAILOUT_SUCCESS';
export const STOP_MAILOUT_ERROR = 'STOP_MAILOUT_ERROR';

export const RESET_MAILOUT = 'RESET_MAILOUT';

export const UPDATE_MAILOUT_SIZE_PENDING = 'UPDATE_MAILOUT_SIZE_PENDING';
export const UPDATE_MAILOUT_SIZE_SUCCESS = 'UPDATE_MAILOUT_SIZE_SUCCESS';
export const UPDATE_MAILOUT_SIZE_ERROR = 'UPDATE_MAILOUT_SIZE_ERROR';

export const UPDATE_MAILOUT_NAME_PENDING = 'UPDATE_MAILOUT_NAME_PENDING';
export const UPDATE_MAILOUT_NAME_SUCCESS = 'UPDATE_MAILOUT_NAME_SUCCESS';
export const UPDATE_MAILOUT_NAME_ERROR = 'UPDATE_MAILOUT_NAME_ERROR';

export const CHANGE_MAILOUT_DISPLAY_AGENT_PENDING = 'CHANGE_MAILOUT_DISPLAY_AGENT_PENDING';
export const CHANGE_MAILOUT_DISPLAY_AGENT_SUCCESS = 'CHANGE_MAILOUT_DISPLAY_AGENT_SUCCESS';
export const CHANGE_MAILOUT_DISPLAY_AGENT_ERROR = 'CHANGE_MAILOUT_DISPLAY_AGENT_ERROR';

export const GET_MAILOUT_EDIT_PENDING = 'GET_MAILOUT_EDIT_PENDING';
export const GET_MAILOUT_EDIT_SUCCESS = 'GET_MAILOUT_EDIT_SUCCESS';
export const GET_MAILOUT_EDIT_ERROR = 'GET_MAILOUT_EDIT_ERROR';

export const UPDATE_MAILOUT_EDIT_PENDING = 'UPDATE_MAILOUT_EDIT_PENDING';
export const UPDATE_MAILOUT_EDIT_SUCCESS = 'UPDATE_MAILOUT_EDIT_SUCCESS';
export const UPDATE_MAILOUT_EDIT_ERROR = 'UPDATE_MAILOUT_EDIT_ERROR';
export const RESET_MAILOUT_EDIT_SUCCESS = 'RESET_MAILOUT_EDIT_SUCCESS';

export const UPDATE_MAILOUT_TEMPLATE_THEME_PENDING = 'UPDATE_MAILOUT_TEMPLATE_THEME_PENDING';
export const UPDATE_MAILOUT_TEMPLATE_THEME_SUCCESS = 'UPDATE_MAILOUT_TEMPLATE_THEME_SUCCESS';
export const UPDATE_MAILOUT_TEMPLATE_THEME_ERROR = 'UPDATE_MAILOUT_TEMPLATE_THEME_ERROR';

export const UPDATE_MAILOUT_EDIT_POLYGON_COORDINATES = 'UPDATE_MAILOUT_EDIT_POLYGON_COORDINATES';

export const ARCHIVE_MAILOUT_PENDING = 'ARCHIVE_MAILOUT_PENDING';
export const ARCHIVE_MAILOUT_SUCCESS = 'ARCHIVE_MAILOUT_SUCCESS';
export const ARCHIVE_MAILOUT_ERROR = 'ARCHIVE_MAILOUT_ERROR';

export const UNDO_ARCHIVE_MAILOUT_PENDING = 'UNDO_ARCHIVE_MAILOUT_PENDING';
export const UNDO_ARCHIVE_MAILOUT_SUCCESS = 'UNDO_ARCHIVE_MAILOUT_SUCCESS';
export const UNDO_ARCHIVE_MAILOUT_ERROR = 'UNDO_ARCHIVE_MAILOUT_ERROR';

export const DUPLICATE_MAILOUT_PENDING = 'DUPLICATE_MAILOUT_PENDING';
export const DUPLICATE_MAILOUT_SUCCESS = 'DUPLICATE_MAILOUT_SUCCESS';
export const DUPLICATE_MAILOUT_ERROR = 'DUPLICATE_MAILOUT_ERROR';

export const SET_MAILOUT_ERROR = 'SET_MAILOUT_ERROR';
export const CLEAR_MAILOUT_ERROR = 'CLEAR_MAILOUT_ERROR';

export const SET_ADD_MAILOUT_ERROR = 'SET_ADD_MAILOUT_ERROR';
export const CLEAR_ADD_MAILOUT_ERROR = 'CLEAR_ADD_MAILOUT_ERROR';

export const UPDATE_MAILOUT_EDIT_VALUES = 'UPDATE_MAILOUT_EDIT_VALUES';

export function getMailoutPending(payload) {
  return createAction(GET_MAILOUT_PENDING, payload);
}

export function getMailoutSuccess(payload) {
  return createAction(GET_MAILOUT_SUCCESS, payload);
}

export function getMailoutError(error) {
  return createErrorAction(GET_MAILOUT_ERROR, error);
}

export function submitMailoutPending(payload) {
  return createAction(SUBMIT_MAILOUT_PENDING, payload);
}

export function submitMailoutSuccess(payload) {
  return createAction(SUBMIT_MAILOUT_SUCCESS, payload);
}

export function submitMailoutError(error) {
  return createErrorAction(SUBMIT_MAILOUT_ERROR, error);
}

export function stopMailoutPending(payload) {
  return createAction(STOP_MAILOUT_PENDING, payload);
}

export function stopMailoutSuccess(payload) {
  return createAction(STOP_MAILOUT_SUCCESS, payload);
}

export function stopMailoutError(error) {
  return createErrorAction(STOP_MAILOUT_ERROR, error);
}

export function resetMailout() {
  return createAction(RESET_MAILOUT);
}

export function updateMailoutSizePending(payload) {
  return createAction(UPDATE_MAILOUT_SIZE_PENDING, payload);
}

export function updateMailoutSizeSuccess(payload) {
  return createAction(UPDATE_MAILOUT_SIZE_SUCCESS, payload);
}

export function updateMailoutSizeError(error) {
  return createErrorAction(UPDATE_MAILOUT_SIZE_ERROR, error);
}

export function updateMailoutNamePending(payload) {
  return createAction(UPDATE_MAILOUT_NAME_PENDING, payload);
}

export function updateMailoutNameSuccess(payload) {
  return createAction(UPDATE_MAILOUT_NAME_SUCCESS, payload);
}

export function updateMailoutNameError(error) {
  return createErrorAction(UPDATE_MAILOUT_NAME_ERROR, error);
}

export function changeMailoutDisplayAgentPending(payload) {
  return createAction(CHANGE_MAILOUT_DISPLAY_AGENT_PENDING, payload);
}

export function changeMailoutDisplayAgentSuccess(payload) {
  return createAction(CHANGE_MAILOUT_DISPLAY_AGENT_SUCCESS, payload);
}

export function changeMailoutDisplayAgentError(error) {
  return createErrorAction(CHANGE_MAILOUT_DISPLAY_AGENT_ERROR, error);
}

export function getMailoutEditPending() {
  return createAction(GET_MAILOUT_EDIT_PENDING);
}

export function getMailoutEditSuccess(payload) {
  return createAction(GET_MAILOUT_EDIT_SUCCESS, payload);
}

export function getMailoutEditError(error) {
  return createErrorAction(GET_MAILOUT_EDIT_ERROR, error);
}

export function updateMailoutEditPending(payload) {
  return createAction(UPDATE_MAILOUT_EDIT_PENDING, payload);
}

export function updateMailoutEditSuccess(payload) {
  return createAction(UPDATE_MAILOUT_EDIT_SUCCESS, payload);
}

export function resetMailoutEditSuccess() {
  return createAction(RESET_MAILOUT_EDIT_SUCCESS);
}

export function updateMailoutEditError(error) {
  return createErrorAction(UPDATE_MAILOUT_EDIT_ERROR, error);
}

export function updateMailoutTemplateThemePending(payload) {
  return createAction(UPDATE_MAILOUT_TEMPLATE_THEME_PENDING, payload);
}

export function updateMailoutTemplateThemeSuccess(payload) {
  return createAction(UPDATE_MAILOUT_TEMPLATE_THEME_SUCCESS, payload);
}

export function updateMailoutTemplateThemeError(error) {
  return createErrorAction(UPDATE_MAILOUT_TEMPLATE_THEME_ERROR, error);
}

export function updateMailoutEditPolygonCoordinates(payload) {
  return createAction(UPDATE_MAILOUT_EDIT_POLYGON_COORDINATES, payload);
}

export function archiveMailoutPending(payload) {
  return createAction(ARCHIVE_MAILOUT_PENDING, payload);
}

export function archiveMailoutSuccess(payload) {
  return createAction(ARCHIVE_MAILOUT_SUCCESS, payload);
}

export function archiveMailoutError(error) {
  return createErrorAction(ARCHIVE_MAILOUT_ERROR, error);
}

export function undoArchiveMailoutPending(payload) {
  return createAction(UNDO_ARCHIVE_MAILOUT_PENDING, payload);
}

export function undoArchiveMailoutSuccess(payload) {
  return createAction(UNDO_ARCHIVE_MAILOUT_SUCCESS, payload);
}

export function undoArchiveMailoutError(error) {
  return createErrorAction(UNDO_ARCHIVE_MAILOUT_ERROR, error);
}

export function duplicateMailoutPending(payload) {
  return createAction(DUPLICATE_MAILOUT_PENDING, payload);
}

export function duplicateMailoutSuccess(payload) {
  return createAction(DUPLICATE_MAILOUT_SUCCESS, payload);
}

export function duplicateMailoutError(error) {
  return createErrorAction(DUPLICATE_MAILOUT_ERROR, error);
}

export function setMailoutError(error) {
  return createAction(SET_MAILOUT_ERROR, error);
}

export function clearMailoutError() {
  return createAction(CLEAR_MAILOUT_ERROR);
}

export function setAddMailoutError(error) {
  return createAction(SET_ADD_MAILOUT_ERROR, error);
}

export function clearAddMailoutError() {
  return createAction(CLEAR_ADD_MAILOUT_ERROR);
}

export function updateMailoutEditValues(payload) {
  return createAction(UPDATE_MAILOUT_EDIT_VALUES, payload);
}
