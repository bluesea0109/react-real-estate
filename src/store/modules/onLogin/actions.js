import { createAction, createErrorAction } from '../../helpers';

export const FETCH_ON_LOGIN_PENDING = 'FETCH_ON_LOGIN_PENDING';
export const FETCH_ON_LOGIN_SUCCESS = 'FETCH_ON_LOGIN_SUCCESS';
export const FETCH_ON_LOGIN_ERROR = 'FETCH_ON_LOGIN_ERROR';

export function fetchOnLoginPending() {
  return createAction(FETCH_ON_LOGIN_PENDING);
}

export function fetchOnLoginSuccess(payload) {
  return createAction(FETCH_ON_LOGIN_SUCCESS, payload);
}

export function fetchOnLoginError(error) {
  return createErrorAction(FETCH_ON_LOGIN_ERROR, error);
}
