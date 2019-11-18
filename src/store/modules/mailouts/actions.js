import { createAction, createErrorAction } from '../../helpers';

export const FETCH_MAILOUT_PENDING = 'FETCH_MAILOUT_PENDING';
export const FETCH_MAILOUT_SUCCESS = 'FETCH_MAILOUT_SUCCESS';
export const FETCH_MAILOUT_ERROR = 'FETCH_MAILOUT_ERROR';

export function fetchMailoutsPending() {
  return createAction(FETCH_MAILOUT_PENDING);
}

export function fetchMailoutsSuccess(payload) {
  return createAction(FETCH_MAILOUT_SUCCESS, payload);
}

export function fetchMailoutsError(error) {
  return createErrorAction(FETCH_MAILOUT_ERROR, error);
}
