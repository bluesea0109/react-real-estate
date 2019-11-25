import { createAction, createErrorAction } from '../../helpers';

export const GET_MAILOUT_DETAILS_PENDING = 'GET_MAILOUT_DETAILS_PENDING';
export const GET_MAILOUT_DETAILS_SUCCESS = 'GET_MAILOUT_DETAILS_SUCCESS';
export const GET_MAILOUT_DETAILS_ERROR = 'GET_MAILOUT_DETAILS_ERROR';

export const NEEDS_UPDATE_MAILOUT_DETAILS_PENDING = 'NEEDS_UPDATE_MAILOUT_DETAILS_PENDING';
export const NEEDS_UPDATE_MAILOUT_DETAILS_SUCCESS = 'NEEDS_UPDATE_MAILOUT_DETAILS_SUCCESS';
export const NEEDS_UPDATE_MAILOUT_DETAILS_ERROR = 'NEEDS_UPDATE_MAILOUT_DETAILS_ERROR';

export const APPROVE_AND_SEND_MAILOUT_DETAILS_PENDING = 'APPROVE_AND_SEND_MAILOUT_DETAILS_PENDING';
export const APPROVE_AND_SEND_MAILOUT_DETAILS_SUCCESS = 'APPROVE_AND_SEND_MAILOUT_DETAILS_SUCCESS';
export const APPROVE_AND_SEND_MAILOUT_DETAILS_ERROR = 'APPROVE_AND_SEND_MAILOUT_DETAILS_ERROR';

export const DELETE_MAILOUT_DETAILS_PENDING = 'DELETE_MAILOUT_DETAILS_PENDING';
export const DELETE_MAILOUT_DETAILS_SUCCESS = 'DELETE_MAILOUT_DETAILS_SUCCESS';
export const DELETE_MAILOUT_DETAILS_ERROR = 'DELETE_MAILOUT_DETAILS_ERROR';

export const RESET_MAILOUT_DETAILS = 'RESET_MAILOUT_DETAILS';

export function fetchMailoutDetailsPending(payload) {
  return createAction(GET_MAILOUT_DETAILS_PENDING, payload);
}

export function fetchMailoutDetailsSuccess(payload) {
  return createAction(GET_MAILOUT_DETAILS_SUCCESS, payload);
}

export function fetchMailoutDetailsError(error) {
  return createErrorAction(GET_MAILOUT_DETAILS_ERROR, error);
}

export function needsUpdateMailoutDetailsPending(payload) {
  return createAction(NEEDS_UPDATE_MAILOUT_DETAILS_PENDING, payload);
}

export function needsUpdateMailoutDetailsSuccess(payload) {
  return createAction(NEEDS_UPDATE_MAILOUT_DETAILS_SUCCESS, payload);
}

export function needsUpdateMailoutDetailsError(error) {
  return createErrorAction(NEEDS_UPDATE_MAILOUT_DETAILS_ERROR, error);
}

export function approveAndSendMailoutDetailsPending(payload) {
  return createAction(APPROVE_AND_SEND_MAILOUT_DETAILS_PENDING, payload);
}

export function approveAndSendMailoutDetailsSuccess(payload) {
  return createAction(APPROVE_AND_SEND_MAILOUT_DETAILS_SUCCESS, payload);
}

export function approveAndSendMailoutDetailsError(error) {
  return createErrorAction(APPROVE_AND_SEND_MAILOUT_DETAILS_ERROR, error);
}

export function deleteMailoutDetailsPending(payload) {
  return createAction(DELETE_MAILOUT_DETAILS_PENDING, payload);
}

export function deleteMailoutDetailsSuccess(payload) {
  return createAction(DELETE_MAILOUT_DETAILS_SUCCESS, payload);
}

export function deleteMailoutDetailsError(error) {
  return createErrorAction(DELETE_MAILOUT_DETAILS_ERROR, error);
}

export function resetMailoutDetails() {
  return createAction(RESET_MAILOUT_DETAILS);
}
