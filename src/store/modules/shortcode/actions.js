import { createAction, createErrorAction } from '../../helpers';

export const GET_SOLD_SHORTCODE_PENDING = 'GET_SOLD_SHORTCODE_PENDING';
export const GET_SOLD_SHORTCODE_SUCCESS = 'GET_SOLD_SHORTCODE_SUCCESS';
export const GET_SOLD_SHORTCODE_ERROR = 'GET_SOLD_SHORTCODE_ERROR';

export const SAVE_SOLD_SHORTCODE_PENDING = 'SAVE_SOLD_SHORTCODE_PENDING';
export const SAVE_SOLD_SHORTCODE_SUCCESS = 'SAVE_SOLD_SHORTCODE_SUCCESS';
export const SAVE_SOLD_SHORTCODE_ERROR = 'SAVE_SOLD_SHORTCODE_ERROR';

export const GET_LISTED_SHORTCODE_PENDING = 'GET_LISTED_SHORTCODE_PENDING';
export const GET_LISTED_SHORTCODE_SUCCESS = 'GET_LISTED_SHORTCODE_SUCCESS';
export const GET_LISTED_SHORTCODE_ERROR = 'GET_LISTED_SHORTCODE_ERROR';

export const SAVE_LISTED_SHORTCODE_PENDING = 'SAVE_LISTED_SHORTCODE_PENDING';
export const SAVE_LISTED_SHORTCODE_SUCCESS = 'SAVE_LISTED_SHORTCODE_SUCCESS';
export const SAVE_LISTED_SHORTCODE_ERROR = 'SAVE_LISTED_SHORTCODE_ERROR';

export function getSoldShortcodePending() {
  return createAction(GET_SOLD_SHORTCODE_PENDING);
}

export function getSoldShortcodeSuccess(payload) {
  return createAction(GET_SOLD_SHORTCODE_SUCCESS, payload);
}

export function getSoldShortcodeError(error) {
  return createErrorAction(GET_SOLD_SHORTCODE_ERROR, error);
}

export function saveSoldShortcodePending(payload) {
  return createAction(SAVE_SOLD_SHORTCODE_PENDING, payload);
}

export function saveSoldShortcodeSuccess(payload) {
  return createAction(SAVE_SOLD_SHORTCODE_SUCCESS, payload);
}

export function saveSoldShortcodeError(error) {
  return createErrorAction(SAVE_SOLD_SHORTCODE_ERROR, error);
}

export function getListedShortcodePending() {
  return createAction(GET_LISTED_SHORTCODE_PENDING);
}

export function getListedShortcodeSuccess(payload) {
  return createAction(GET_LISTED_SHORTCODE_SUCCESS, payload);
}

export function getListedShortcodeError(error) {
  return createErrorAction(GET_LISTED_SHORTCODE_ERROR, error);
}

export function saveListedShortcodePending(payload) {
  return createAction(SAVE_LISTED_SHORTCODE_PENDING, payload);
}

export function saveListedShortcodeSuccess(payload) {
  return createAction(SAVE_LISTED_SHORTCODE_SUCCESS, payload);
}

export function saveListedShortcodeError(error) {
  return createErrorAction(SAVE_LISTED_SHORTCODE_ERROR, error);
}
