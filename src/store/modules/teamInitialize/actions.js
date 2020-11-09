import { createAction, createErrorAction } from '../../utils/helpers';

export const INITIALIZE_TEAM_PENDING = 'INITIALIZE_TEAM_PENDING';
export const INITIALIZE_TEAM_SUCCESS = 'INITIALIZE_TEAM_SUCCESS';
export const INITIALIZE_TEAM_ERROR = 'INITIALIZE_TEAM_ERROR';

export const INITIALIZE_TEAM_POLLING_START = 'INITIALIZE_TEAM_POLLING_START';
export const INITIALIZE_TEAM_POLLING_STOP = 'INITIALIZE_TEAM_POLLING_STOP';

export function initializeTeamPending() {
  return createAction(INITIALIZE_TEAM_PENDING);
}

export function initializeTeamSuccess(payload) {
  return createAction(INITIALIZE_TEAM_SUCCESS, payload);
}

export function initializeTeamError(error) {
  return createErrorAction(INITIALIZE_TEAM_ERROR, error);
}

export function initializeTeamPollingStart() {
  return createAction(INITIALIZE_TEAM_POLLING_START);
}

export function initializeTeamPollingStop() {
  return createAction(INITIALIZE_TEAM_POLLING_STOP);
}
