import { createAction, createErrorAction } from '../../helpers';

export const GENERATE_POSTCARDS_PREVIEW_PENDING = 'GENERATE_POSTCARDS_PREVIEW_PENDING';
export const GENERATE_POSTCARDS_PREVIEW_SUCCESS = 'GENERATE_POSTCARDS_PREVIEW_SUCCESS';
export const GENERATE_POSTCARDS_PREVIEW_ERROR = 'GENERATE_POSTCARDS_PREVIEW_ERROR';

export function generatePostcardsPreviewPending() {
  return createAction(GENERATE_POSTCARDS_PREVIEW_PENDING);
}

export function generatePostcardsPreviewSuccess(payload) {
  return createAction(GENERATE_POSTCARDS_PREVIEW_SUCCESS, payload);
}

export function generatePostcardsPreviewError(error) {
  return createErrorAction(GENERATE_POSTCARDS_PREVIEW_ERROR, error);
}
