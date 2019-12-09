import { createAction, createErrorAction } from '../../helpers';

export const GET_TEMPLATES_PENDING = 'GET_TEMPLATES_PENDING';
export const GET_TEMPLATES_SUCCESS = 'GET_TEMPLATES_SUCCESS';
export const GET_TEMPLATES_ERROR = 'GET_TEMPLATES_ERROR';

export function getTemplatesPending() {
  return createAction(GET_TEMPLATES_PENDING);
}

export function getTemplatesSuccess(payload) {
  return createAction(GET_TEMPLATES_SUCCESS, payload);
}

export function getTemplatesError(error) {
  return createErrorAction(GET_TEMPLATES_ERROR, error);
}
