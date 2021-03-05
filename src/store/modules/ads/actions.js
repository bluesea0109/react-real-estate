import { createAction, createErrorAction } from '../../utils/helpers';

export const GET_ADS_TOOL_PENDING = 'GET_ADS_TOOL_PENDING';
export const GET_ADS_TOOL_SUCCESS = 'GET_ADS_TOOL_SUCCESS';
export const GET_ADS_TOOL_ERROR = 'GET_ADS_TOOL_ERROR';

export function getAdsTool(payload) {
  return createAction(GET_ADS_TOOL_PENDING, payload);
}

export function getAdsToolSuccess(payload) {
  return createAction(GET_ADS_TOOL_SUCCESS, payload);
}

export function getAdsToolError(error) {
  return createErrorAction(GET_ADS_TOOL_ERROR, error);
}
