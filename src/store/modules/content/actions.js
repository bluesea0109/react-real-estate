import { createAction, createErrorAction } from '../../utils/helpers';

export const GET_READY_MADE_CONTENT_PENDING = 'GET_READY_MADE_CONTENT_PENDING';
export const GET_READY_MADE_CONTENT_SUCCESS = 'GET_READY_MADE_CONTENT_SUCCESS';
export const GET_READY_MADE_CONTENT_ERROR = 'GET_READY_MADE_CONTENT_ERROR';

export function getReadyMadeContentPending() {
  return createAction(GET_READY_MADE_CONTENT_PENDING);
}

export function getReadyMadeContentSuccess(payload) {
  return createAction(GET_READY_MADE_CONTENT_SUCCESS, payload);
}

export function getReadyMadeContentError() {
  return createErrorAction(GET_READY_MADE_CONTENT_ERROR);
}
