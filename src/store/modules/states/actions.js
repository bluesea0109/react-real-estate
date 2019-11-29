import { createAction, createErrorAction } from '../../helpers';

export const GET_STATES_PENDING = 'GET_STATES_PENDING';
export const GET_STATES_SUCCESS = 'GET_STATES_SUCCESS';
export const GET_STATES_ERROR = 'GET_STATES_ERROR';

export function getStatesPending() {
  return createAction(GET_STATES_PENDING);
}

export function getStatesSuccess(payload) {
  return createAction(GET_STATES_SUCCESS, payload);
}

export function getStatesError(error) {
  return createErrorAction(GET_STATES_ERROR, error);
}
