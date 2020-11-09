import { createAction, createErrorAction } from '../../utils/helpers';

export const GET_TEAM_PENDING = 'GET_TEAM_PENDING';
export const GET_TEAM_SUCCESS = 'GET_TEAM_SUCCESS';
export const GET_TEAM_ERROR = 'GET_TEAM_ERROR';

export const SYNC_PENDING = 'SYNC_PENDING';
export const SYNC_SUCCESS = 'SYNC_SUCCESS';
export const SYNC_ERROR = 'SYNC_ERROR';

export function getTeamPending() {
  return createAction(GET_TEAM_PENDING);
}

export function getTeamSuccess(payload) {
  return createAction(GET_TEAM_SUCCESS, payload);
}

export function getTeamError(error) {
  return createErrorAction(GET_TEAM_ERROR, error);
}

export function syncPending() {
  return createAction(SYNC_PENDING);
}

export function syncSuccess(payload) {
  return createAction(SYNC_SUCCESS, payload);
}

export function syncError(error) {
  return createErrorAction(SYNC_ERROR, error);
}
