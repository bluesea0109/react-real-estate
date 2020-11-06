import { createAction, createErrorAction } from '../../utils/helpers';

export const INITIALIZE_USER_PENDING = 'INITIALIZE_USER_PENDING';
export const INITIALIZE_USER_SUCCESS = 'INITIALIZE_USER_SUCCESS';
export const INITIALIZE_USER_ERROR = 'INITIALIZE_USER_ERROR';

export const INITIALIZE_USER_POLLING_START = 'INITIALIZE_USER_POLLING_START';
export const INITIALIZE_USER_POLLING_STOP = 'INITIALIZE_USER_POLLING_STOP';

export function initializeUserPending() {
  return createAction(INITIALIZE_USER_PENDING);
}

export function initializeUserSuccess(payload) {
  return createAction(INITIALIZE_USER_SUCCESS, payload);
}

export function initializeUserError(error) {
  return createErrorAction(INITIALIZE_USER_ERROR, error);
}

export function initializeUserPollingStart() {
  return createAction(INITIALIZE_USER_POLLING_START);
}

export function initializeUserPollingStop() {
  return createAction(INITIALIZE_USER_POLLING_STOP);
}
