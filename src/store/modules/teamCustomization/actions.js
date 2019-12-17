import { createAction, createErrorAction } from '../../helpers';

export const GET_TEAM_CUSTOMIZATION_PENDING = 'GET_TEAM_CUSTOMIZATION_PENDING';
export const GET_TEAM_CUSTOMIZATION_SUCCESS = 'GET_TEAM_CUSTOMIZATION_SUCCESS';
export const GET_TEAM_CUSTOMIZATION_ERROR = 'GET_TEAM_CUSTOMIZATION_ERROR';

export const SAVE_TEAM_CUSTOMIZATION_PENDING = 'SAVE_TEAM_CUSTOMIZATION_PENDING';
export const SAVE_TEAM_CUSTOMIZATION_SUCCESS = 'SAVE_TEAM_CUSTOMIZATION_SUCCESS';
export const SAVE_TEAM_CUSTOMIZATION_ERROR = 'SAVE_TEAM_CUSTOMIZATION_ERROR';

export const REVIEW_TEAM_CUSTOMIZATION_COMPLETED = 'REVIEW_TEAM_CUSTOMIZATION_COMPLETED';

export function getTeamCustomizationPending() {
  return createAction(GET_TEAM_CUSTOMIZATION_PENDING);
}

export function getTeamCustomizationSuccess(payload) {
  return createAction(GET_TEAM_CUSTOMIZATION_SUCCESS, payload);
}

export function getTeamCustomizationError(error) {
  return createErrorAction(GET_TEAM_CUSTOMIZATION_ERROR, error);
}

export function saveTeamCustomizationPending(payload) {
  return createAction(SAVE_TEAM_CUSTOMIZATION_PENDING, payload);
}

export function saveTeamCustomizationSuccess(payload) {
  return createAction(SAVE_TEAM_CUSTOMIZATION_SUCCESS, payload);
}

export function saveTeamCustomizationError(error) {
  return createErrorAction(SAVE_TEAM_CUSTOMIZATION_ERROR, error);
}

export function reviewTeamCustomizationCompleted(payload) {
  return createAction(REVIEW_TEAM_CUSTOMIZATION_COMPLETED, payload);
}
