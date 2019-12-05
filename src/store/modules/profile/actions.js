import { createAction, createErrorAction } from '../../helpers';

export const SAVE_PROFILE_PENDING = 'SAVE_PROFILE_PENDING';
export const SAVE_PROFILE_SUCCESS = 'SAVE_PROFILE_SUCCESS';
export const SAVE_PROFILE_ERROR = 'SAVE_PROFILE_ERROR';

export function saveProfilePending(payload) {
  return createAction(SAVE_PROFILE_PENDING, payload);
}

export function saveProfileSuccess(payload) {
  return createAction(SAVE_PROFILE_SUCCESS, payload);
}

export function saveProfileError(error) {
  return createErrorAction(SAVE_PROFILE_ERROR, error);
}
