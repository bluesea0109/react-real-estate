import { createAction, createErrorAction } from '../../helpers';

export const SAVE_TEAM_PROFILE_PENDING = 'SAVE_TEAM_PROFILE_PENDING';
export const SAVE_TEAM_PROFILE_SUCCESS = 'SAVE_TEAM_PROFILE_SUCCESS';
export const SAVE_TEAM_PROFILE_ERROR = 'SAVE_TEAM_PROFILE_ERROR';

export function saveTeamProfilePending(payload) {
  return createAction(SAVE_TEAM_PROFILE_PENDING, payload);
}

export function saveTeamProfileSuccess(payload) {
  return createAction(SAVE_TEAM_PROFILE_SUCCESS, payload);
}

export function saveTeamProfileError(error) {
  return createErrorAction(SAVE_TEAM_PROFILE_ERROR, error);
}
