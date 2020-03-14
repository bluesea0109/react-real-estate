import { createAction, createErrorAction } from '../../helpers';

export const GET_CUSTOMIZATION_PENDING = 'GET_CUSTOMIZATION_PENDING';
export const GET_CUSTOMIZATION_SUCCESS = 'GET_CUSTOMIZATION_SUCCESS';
export const GET_CUSTOMIZATION_ERROR = 'GET_CUSTOMIZATION_ERROR';

export const SAVE_CUSTOMIZATION_PENDING = 'SAVE_CUSTOMIZATION_PENDING';
export const SAVE_CUSTOMIZATION_SUCCESS = 'SAVE_CUSTOMIZATION_SUCCESS';
export const SAVE_CUSTOMIZATION_ERROR = 'SAVE_CUSTOMIZATION_ERROR';

export const REVIEW_CUSTOMIZATION_COMPLETED = 'REVIEW_CUSTOMIZATION_COMPLETED';

export const PREVIEW_CUSTOMIZATION_COMPLETED = 'PREVIEW_CUSTOMIZATION_COMPLETED';

export function getCustomizationPending() {
  return createAction(GET_CUSTOMIZATION_PENDING);
}

export function getCustomizationSuccess(payload) {
  return createAction(GET_CUSTOMIZATION_SUCCESS, payload);
}

export function getCustomizationError(error) {
  return createErrorAction(GET_CUSTOMIZATION_ERROR, error);
}

export function saveCustomizationPending(payload) {
  return createAction(SAVE_CUSTOMIZATION_PENDING, payload);
}

export function saveCustomizationSuccess(payload) {
  return createAction(SAVE_CUSTOMIZATION_SUCCESS, payload);
}

export function saveCustomizationError(error) {
  return createErrorAction(SAVE_CUSTOMIZATION_ERROR, error);
}

export function reviewCustomizationCompleted() {
  return createAction(REVIEW_CUSTOMIZATION_COMPLETED);
}

export function previewCustomizationCompleted() {
  return createAction(PREVIEW_CUSTOMIZATION_COMPLETED);
}
