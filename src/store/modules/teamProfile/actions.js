import { createAction, createErrorAction } from '../../helpers';

export const GET_TEAM_PROFILE_PENDING = 'GET_TEAM_PROFILE_PENDING';
export const GET_TEAM_PROFILE_SUCCESS = 'GET_TEAM_PROFILE_SUCCESS';
export const GET_TEAM_PROFILE_ERROR = 'GET_TEAM_PROFILE_ERROR';

export const SAVE_TEAM_PROFILE_PENDING = 'SAVE_TEAM_PROFILE_PENDING';
export const SAVE_TEAM_PROFILE_SUCCESS = 'SAVE_TEAM_PROFILE_SUCCESS';
export const SAVE_TEAM_PROFILE_ERROR = 'SAVE_TEAM_PROFILE_ERROR';

export function getTeamProfilePending() {
  return createAction(GET_TEAM_PROFILE_PENDING);
}

export function getTeamProfileSuccess(payload) {
  return createAction(GET_TEAM_PROFILE_SUCCESS, payload);
}

export function getTeamProfileError(error) {
  return createErrorAction(GET_TEAM_PROFILE_ERROR, error);
}

export function saveTeamProfilePending(payload) {
  return createAction(SAVE_TEAM_PROFILE_PENDING, payload);
}

export function saveTeamProfileSuccess(payload) {
  return createAction(SAVE_TEAM_PROFILE_SUCCESS, payload);
}

export function saveTeamProfileError(error) {
  return createErrorAction(SAVE_TEAM_PROFILE_ERROR, error);
}
