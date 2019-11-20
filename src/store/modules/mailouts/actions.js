import { createAction, createErrorAction } from '../../helpers';

export const FETCH_MAILOUTS_PENDING = 'FETCH_MAILOUTS_PENDING';
export const FETCH_MAILOUTS_SUCCESS = 'FETCH_MAILOUTS_SUCCESS';
export const FETCH_MAILOUTS_ERROR = 'FETCH_MAILOUTS_ERROR';
export const TOGGLE_CAN_FETCH_MORE = 'TOGGLE_CAN_FETCH_MORE';
export const FETCH_MORE_MAILOUTS_PENDING = 'FETCH_MORE_MAILOUTS_PENDING';
export const FETCH_MORE_MAILOUTS_SUCCESS = 'FETCH_MORE_MAILOUTS_SUCCESS';
export const FETCH_MORE_MAILOUTS_ERROR = 'FETCH_MORE_MAILOUTS_ERROR';

export const RESET_MAILOUTS = 'RESET_MAILOUTS';

export function fetchMailoutsPending() {
  return createAction(FETCH_MAILOUTS_PENDING);
}

export function fetchMailoutsSuccess(payload) {
  return createAction(FETCH_MAILOUTS_SUCCESS, payload);
}

export function fetchMailoutsError(error) {
  return createErrorAction(FETCH_MAILOUTS_ERROR, error);
}

export function setCanFetchMore(payload) {
  return createAction(TOGGLE_CAN_FETCH_MORE, payload);
}

export function fetchMoreMailoutsPending(payload) {
  return createAction(FETCH_MORE_MAILOUTS_PENDING, payload);
}

export function fetchMoreMailoutsSuccess(payload) {
  return createAction(FETCH_MORE_MAILOUTS_SUCCESS, payload);
}

export function fetchMoreMailoutsError(error) {
  return createErrorAction(FETCH_MORE_MAILOUTS_ERROR, error);
}

export function resetMailouts() {
  return createAction(RESET_MAILOUTS);
}
