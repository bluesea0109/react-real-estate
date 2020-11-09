import { createAction, createErrorAction } from '../../utils/helpers';

export const GET_BOARDS_PENDING = 'GET_BOARDS_PENDING';
export const GET_BOARDS_SUCCESS = 'GET_BOARDS_SUCCESS';
export const GET_BOARDS_ERROR = 'GET_BOARDS_ERROR';

export function getBoardsPending() {
  return createAction(GET_BOARDS_PENDING);
}

export function getBoardsSuccess(payload) {
  return createAction(GET_BOARDS_SUCCESS, payload);
}

export function getBoardsError(error) {
  return createErrorAction(GET_BOARDS_ERROR, error);
}
