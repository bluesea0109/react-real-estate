import { createAction, createErrorAction } from '../../helpers';

export const GET_TEAM_SOLD_SHORTCODE_PENDING = 'GET_TEAM_SOLD_SHORTCODE_PENDING';
export const GET_TEAM_SOLD_SHORTCODE_SUCCESS = 'GET_TEAM_SOLD_SHORTCODE_SUCCESS';
export const GET_TEAM_SOLD_SHORTCODE_ERROR = 'GET_TEAM_SOLD_SHORTCODE_ERROR';

export const SAVE_TEAM_SOLD_SHORTCODE_PENDING = 'SAVE_TEAM_SOLD_SHORTCODE_PENDING';
export const SAVE_TEAM_SOLD_SHORTCODE_SUCCESS = 'SAVE_TEAM_SOLD_SHORTCODE_SUCCESS';
export const SAVE_TEAM_SOLD_SHORTCODE_ERROR = 'SAVE_TEAM_SOLD_SHORTCODE_ERROR';

export const GET_TEAM_LISTED_SHORTCODE_PENDING = 'GET_TEAM_LISTED_SHORTCODE_PENDING';
export const GET_TEAM_LISTED_SHORTCODE_SUCCESS = 'GET_TEAM_LISTED_SHORTCODE_SUCCESS';
export const GET_TEAM_LISTED_SHORTCODE_ERROR = 'GET_TEAM_LISTED_SHORTCODE_ERROR';

export const SAVE_TEAM_LISTED_SHORTCODE_PENDING = 'SAVE_TEAM_LISTED_SHORTCODE_PENDING';
export const SAVE_TEAM_LISTED_SHORTCODE_SUCCESS = 'SAVE_TEAM_LISTED_SHORTCODE_SUCCESS';
export const SAVE_TEAM_LISTED_SHORTCODE_ERROR = 'SAVE_TEAM_LISTED_SHORTCODE_ERROR';

export function getTeamSoldShortcodePending() {
  return createAction(GET_TEAM_SOLD_SHORTCODE_PENDING);
}

export function getTeamSoldShortcodeSuccess(payload) {
  return createAction(GET_TEAM_SOLD_SHORTCODE_SUCCESS, payload);
}

export function getTeamSoldShortcodeError(error) {
  return createErrorAction(GET_TEAM_SOLD_SHORTCODE_ERROR, error);
}

export function saveTeamSoldShortcodePending(payload) {
  return createAction(SAVE_TEAM_SOLD_SHORTCODE_PENDING, payload);
}

export function saveTeamSoldShortcodeSuccess(payload) {
  return createAction(SAVE_TEAM_SOLD_SHORTCODE_SUCCESS, payload);
}

export function saveTeamSoldShortcodeError(error) {
  return createErrorAction(SAVE_TEAM_SOLD_SHORTCODE_ERROR, error);
}

export function getTeamListedShortcodePending() {
  return createAction(GET_TEAM_LISTED_SHORTCODE_PENDING);
}

export function getTeamListedShortcodeSuccess(payload) {
  return createAction(GET_TEAM_LISTED_SHORTCODE_SUCCESS, payload);
}

export function getTeamListedShortcodeError(error) {
  return createErrorAction(GET_TEAM_LISTED_SHORTCODE_ERROR, error);
}

export function saveTeamListedShortcodePending(payload) {
  return createAction(SAVE_TEAM_LISTED_SHORTCODE_PENDING, payload);
}

export function saveTeamListedShortcodeSuccess(payload) {
  return createAction(SAVE_TEAM_LISTED_SHORTCODE_SUCCESS, payload);
}

export function saveTeamListedShortcodeError(error) {
  return createErrorAction(SAVE_TEAM_LISTED_SHORTCODE_ERROR, error);
}
