import { createAction, createErrorAction } from '../../helpers';

export const GET_MAILOUTS_PENDING = 'GET_MAILOUTS_PENDING';
export const GET_MAILOUTS_SUCCESS = 'GET_MAILOUTS_SUCCESS';
export const GET_MAILOUTS_ERROR = 'GET_MAILOUTS_ERROR';
export const TOGGLE_CAN_GET_MORE = 'TOGGLE_CAN_GET_MORE';
export const GET_MORE_MAILOUTS_PENDING = 'GET_MORE_MAILOUTS_PENDING';
export const GET_MORE_MAILOUTS_SUCCESS = 'GET_MORE_MAILOUTS_SUCCESS';
export const GET_MORE_MAILOUTS_ERROR = 'GET_MORE_MAILOUTS_ERROR';

export const RESET_MAILOUTS = 'RESET_MAILOUTS';

export function fetchMailoutsPending() {
  return createAction(GET_MAILOUTS_PENDING);
}

export function fetchMailoutsSuccess(payload) {
  return createAction(GET_MAILOUTS_SUCCESS, payload);
}

export function fetchMailoutsError(error) {
  return createErrorAction(GET_MAILOUTS_ERROR, error);
}

export function setCanFetchMore(payload) {
  return createAction(TOGGLE_CAN_GET_MORE, payload);
}

export function fetchMoreMailoutsPending(payload) {
  return createAction(GET_MORE_MAILOUTS_PENDING, payload);
}

export function fetchMoreMailoutsSuccess(payload) {
  return createAction(GET_MORE_MAILOUTS_SUCCESS, payload);
}

export function fetchMoreMailoutsError(error) {
  return createErrorAction(GET_MORE_MAILOUTS_ERROR, error);
}

export function resetMailouts() {
  return createAction(RESET_MAILOUTS);
}
