import { createAction, createErrorAction } from '../../utils/helpers';

export const SAVE_SOLD_SHORTCODE_PENDING = 'SAVE_SOLD_SHORTCODE_PENDING';
export const SAVE_SOLD_SHORTCODE_SUCCESS = 'SAVE_SOLD_SHORTCODE_SUCCESS';
export const SAVE_SOLD_SHORTCODE_ERROR = 'SAVE_SOLD_SHORTCODE_ERROR';

export const SAVE_LISTED_SHORTCODE_PENDING = 'SAVE_LISTED_SHORTCODE_PENDING';
export const SAVE_LISTED_SHORTCODE_SUCCESS = 'SAVE_LISTED_SHORTCODE_SUCCESS';
export const SAVE_LISTED_SHORTCODE_ERROR = 'SAVE_LISTED_SHORTCODE_ERROR';

export function saveSoldShortcodePending(payload) {
  return createAction(SAVE_SOLD_SHORTCODE_PENDING, payload);
}

export function saveSoldShortcodeSuccess(payload) {
  return createAction(SAVE_SOLD_SHORTCODE_SUCCESS, payload);
}

export function saveSoldShortcodeError(error) {
  return createErrorAction(SAVE_SOLD_SHORTCODE_ERROR, error);
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
