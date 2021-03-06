import { createAction, createErrorAction } from '../../utils/helpers';

export const GET_ON_LOGIN_PENDING = 'GET_ON_LOGIN_PENDING';
export const GET_ON_LOGIN_SUCCESS = 'GET_ON_LOGIN_SUCCESS';
export const GET_ON_LOGIN_ERROR = 'GET_ON_LOGIN_ERROR';

export function getOnLoginPending() {
  return createAction(GET_ON_LOGIN_PENDING);
}

export function getOnLoginSuccess(payload) {
  return createAction(GET_ON_LOGIN_SUCCESS, payload);
}

export function getOnLoginError(error) {
  return createErrorAction(GET_ON_LOGIN_ERROR, error);
}
