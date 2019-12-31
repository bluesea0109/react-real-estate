import { createAction, createErrorAction } from '../../helpers';

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

export const CHECK_IF_MAILOUT_NEEDS_UPDATE_PENDING = 'CHECK_IF_MAILOUT_NEEDS_UPDATE_PENDING';
export const CHECK_IF_MAILOUT_NEEDS_UPDATE_SUCCESS = 'CHECK_IF_MAILOUT_NEEDS_UPDATE_SUCCESS';
export const CHECK_IF_MAILOUT_NEEDS_UPDATE_ERROR = 'CHECK_IF_MAILOUT_NEEDS_UPDATE_ERROR';

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

export function checkIfMailoutNeedsUpdatePending() {
  return createAction(CHECK_IF_MAILOUT_NEEDS_UPDATE_PENDING);
}

export function checkIfMailoutNeedsUpdateSuccess(payload) {
  return createAction(CHECK_IF_MAILOUT_NEEDS_UPDATE_SUCCESS, payload);
}

export function checkIfMailoutNeedsUpdateError(error) {
  return createErrorAction(CHECK_IF_MAILOUT_NEEDS_UPDATE_ERROR, error);
}
