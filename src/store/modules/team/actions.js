import { createAction, createErrorAction } from '../../helpers';

export const GET_TEAM_PENDING = 'GET_TEAM_PENDING';
export const GET_TEAM_SUCCESS = 'GET_TEAM_SUCCESS';
export const GET_TEAM_ERROR = 'GET_TEAM_ERROR';

export function fetchTeamPending() {
  return createAction(GET_TEAM_PENDING);
}

export function fetchTeamSuccess(payload) {
  return createAction(GET_TEAM_SUCCESS, payload);
}

export function fetchTeamError(error) {
  return createErrorAction(GET_TEAM_ERROR, error);
}
