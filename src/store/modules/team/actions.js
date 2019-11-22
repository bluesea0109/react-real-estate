import { createAction, createErrorAction } from '../../helpers';

export const FETCH_TEAM_PENDING = 'FETCH_TEAM_PENDING';
export const FETCH_TEAM_SUCCESS = 'FETCH_TEAM_SUCCESS';
export const FETCH_TEAM_ERROR = 'FETCH_TEAM_ERROR';

export function fetchTeamPending() {
  return createAction(FETCH_TEAM_PENDING);
}

export function fetchTeamSuccess(payload) {
  return createAction(FETCH_TEAM_SUCCESS, payload);
}

export function fetchTeamError(error) {
  return createErrorAction(FETCH_TEAM_ERROR, error);
}
