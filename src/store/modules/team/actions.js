import { createAction, createErrorAction } from '../../helpers';

export const GET_TEAM_PENDING = 'GET_TEAM_PENDING';
export const GET_TEAM_SUCCESS = 'GET_TEAM_SUCCESS';
export const GET_TEAM_ERROR = 'GET_TEAM_ERROR';

export function getTeamPending() {
  return createAction(GET_TEAM_PENDING);
}

export function getTeamSuccess(payload) {
  return createAction(GET_TEAM_SUCCESS, payload);
}

export function getTeamError(error) {
  return createErrorAction(GET_TEAM_ERROR, error);
}
