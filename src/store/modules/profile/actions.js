import { createAction, createErrorAction } from '../../helpers';

export const GET_PROFILE_PENDING = 'GET_PROFILE_PENDING';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_ERROR = 'GET_PROFILE_ERROR';

export const SAVE_PROFILE_PENDING = 'SAVE_PROFILE_PENDING';
export const SAVE_PROFILE_SUCCESS = 'SAVE_PROFILE_SUCCESS';
export const SAVE_PROFILE_ERROR = 'SAVE_PROFILE_ERROR';

export function getProfilePending() {
  return createAction(GET_PROFILE_PENDING);
}

export function getProfileSuccess(payload) {
  return createAction(GET_PROFILE_SUCCESS, payload);
}

export function getProfileError(error) {
  return createErrorAction(GET_PROFILE_ERROR, error);
}

export function saveProfilePending(payload) {
  return createAction(SAVE_PROFILE_PENDING, payload);
}

export function saveProfileSuccess(payload) {
  return createAction(SAVE_PROFILE_SUCCESS, payload);
}

export function saveProfileError(error) {
  return createErrorAction(SAVE_PROFILE_ERROR, error);
}
