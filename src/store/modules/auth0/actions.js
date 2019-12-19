import { createAction, createErrorAction } from '../../helpers';

export const AUTHENTICATION_PENDING = 'AUTHENTICATION_PENDING';
export const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

export const COOKIE_AUTHENTICATION = 'COOKIE_AUTHENTICATION';

export function authenticate() {
  return createAction(AUTHENTICATION_PENDING);
}

export function authenticationSuccess(payload) {
  return createAction(AUTHENTICATION_SUCCESS, payload);
}

export function authenticationError(error) {
  return createErrorAction(AUTHENTICATION_ERROR, error);
}

export function cookieAuthentication(payload) {
  return createAction(COOKIE_AUTHENTICATION, payload);
}
