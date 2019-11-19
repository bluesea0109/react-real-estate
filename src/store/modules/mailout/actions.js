import { createAction, createErrorAction } from '../../helpers';

export const FETCH_MAILOUT_DETAILS_PENDING = 'FETCH_MAILOUT_DETAILS_PENDING';
export const FETCH_MAILOUT_DETAILS_SUCCESS = 'FETCH_MAILOUT_DETAILS_SUCCESS';
export const FETCH_MAILOUT_DETAILS_ERROR = 'FETCH_MAILOUT_DETAILS_ERROR';

export function fetchMailoutDetailsPending(payload) {
  return createAction(FETCH_MAILOUT_DETAILS_PENDING, payload);
}

export function fetchMailoutDetailsSuccess(payload) {
  return createAction(FETCH_MAILOUT_DETAILS_SUCCESS, payload);
}

export function fetchMailoutDetailsError(error) {
  return createErrorAction(FETCH_MAILOUT_DETAILS_ERROR, error);
}
