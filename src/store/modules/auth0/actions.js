import { createAction, createErrorAction } from '../../utils/helpers';

export const AUTHENTICATION_PENDING = 'AUTHENTICATION_PENDING';
export const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

export const COOKIE_AUTHENTICATION = 'COOKIE_AUTHENTICATION';

export const PASSWORD_RESET_PENDING = 'PASSWORD_RESET_PENDING';
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS';
export const PASSWORD_RESET_ERROR = 'PASSWORD_RESET_ERROR';

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

export function passwordReset() {
  return createAction(PASSWORD_RESET_PENDING);
}

export function passwordResetSuccess(payload) {
  return createAction(PASSWORD_RESET_SUCCESS, payload);
}

export function passwordResetError(error) {
  return createErrorAction(PASSWORD_RESET_ERROR, error);
}
