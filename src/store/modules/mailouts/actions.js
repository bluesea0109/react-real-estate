import { createAction, createErrorAction } from '../../utils/helpers';

export const GET_MAILOUTS_PENDING = 'GET_MAILOUTS_PENDING';
export const GET_MAILOUTS_SUCCESS = 'GET_MAILOUTS_SUCCESS';
export const GET_MAILOUTS_ERROR = 'GET_MAILOUTS_ERROR';
export const TOGGLE_CAN_GET_MORE = 'TOGGLE_CAN_GET_MORE';
export const GET_MORE_MAILOUTS_PENDING = 'GET_MORE_MAILOUTS_PENDING';
export const GET_MORE_MAILOUTS_SUCCESS = 'GET_MORE_MAILOUTS_SUCCESS';
export const GET_MORE_MAILOUTS_ERROR = 'GET_MORE_MAILOUTS_ERROR';

export const RESET_MAILOUTS = 'RESET_MAILOUTS';

export const GENERATE_MAILOUTS_PENDING = 'GENERATE_MAILOUTS_PENDING';
export const GENERATE_MAILOUTS_SUCCESS = 'GENERATE_MAILOUTS_SUCCESS';
export const GENERATE_MAILOUTS_ERROR = 'GENERATE_MAILOUTS_ERROR';

export const GET_ARCHIVED_MAILOUTS_PENDING = 'GET_ARCHIVED_MAILOUTS_PENDING';
export const GET_ARCHIVED_MAILOUTS_SUCCESS = 'GET_ARCHIVED_MAILOUTS_SUCCESS';
export const GET_ARCHIVED_MAILOUTS_ERROR = 'GET_ARCHIVED_MAILOUTS_ERROR';
export const GET_MORE_ARCHIVED_MAILOUTS_PENDING = 'GET_MORE_ARCHIVED_MAILOUTS_PENDING';
export const GET_MORE_ARCHIVED_MAILOUTS_SUCCESS = 'GET_MORE_ARCHIVED_MAILOUTS_SUCCESS';
export const GET_MORE_ARCHIVED_MAILOUTS_ERROR = 'GET_MORE_ARCHIVED_MAILOUTS_ERROR';

export const ADD_CAMPAIGN_START = 'ADD_CAMPAIGN_START';
export const ADD_CAMPAIGN_SUCCESS = 'ADD_CAMPAIGN_SUCCESS';
export const ADD_CAMPAIGN_ERROR = 'ADD_CAMPAIGN_ERROR';

export const ADD_CAMPAIGN_RESET = 'ADD_CAMPAIGN_RESET';

export const ADD_HOLIDAY_CAMPAIGN_START = 'ADD_HOLIDAY_CAMPAIGN_START';
export const ADD_HOLIDAY_CAMPAIGN_SUCCESS = 'ADD_HOLIDAY_CAMPAIGN_SUCCESS';
export const ADD_HOLIDAY_CAMPAIGN_ERROR = 'ADD_HOLIDAY_CAMPAIGN_ERROR';

export const SET_MAILOUTS_ERROR = 'SET_MAILOUT_ERROR';
export const CLEAR_MAILOUTS_ERROR = 'CLEAR_MAILOUT_ERROR';

export const SHOW_ADD_CAMPAIGN_MODAL = 'SHOW_ADD_CAMPAIGN_MODAL';
export const HIDE_ADD_CAMPAIGN_MODAL = 'HIDE_ADD_CAMPAIGN_MODAL';

export const GET_FILTERED_MAILOUTS_SUCCESS = 'GET_FILTERED_MAILOUTS_SUCCESS';
export const GET_FILTERED_MAILOUTS_PENDING = 'GET_FILTERED_MAILOUTS_PENDING';
export const GET_FILTERED_MAILOUTS_ERROR = 'GET_FILTERED_MAILOUTS_ERROR';

export function getMailoutsPending() {
  return createAction(GET_MAILOUTS_PENDING);
}

export function getMailoutsSuccess(payload) {
  return createAction(GET_MAILOUTS_SUCCESS, payload);
}

export function getMailoutsError(error) {
  return createErrorAction(GET_MAILOUTS_ERROR, error);
}

export function setCanFetchMore(payload) {
  return createAction(TOGGLE_CAN_GET_MORE, payload);
}

export function getMoreMailoutsPending(payload) {
  return createAction(GET_MORE_MAILOUTS_PENDING, payload);
}

export function getMoreMailoutsSuccess(payload) {
  return createAction(GET_MORE_MAILOUTS_SUCCESS, payload);
}

export function getMoreMailoutsError(error) {
  return createErrorAction(GET_MORE_MAILOUTS_ERROR, error);
}

export function resetMailouts() {
  return createAction(RESET_MAILOUTS);
}

export function generateMailoutsPending() {
  return createAction(GENERATE_MAILOUTS_PENDING);
}

export function generateMailoutsSuccess(payload) {
  return createAction(GENERATE_MAILOUTS_SUCCESS, payload);
}

export function generateMailoutsError(error) {
  return createErrorAction(GENERATE_MAILOUTS_ERROR, error);
}

export function getArchivedMailoutsPending() {
  return createAction(GET_ARCHIVED_MAILOUTS_PENDING);
}

export function getArchivedMailoutsSuccess(payload) {
  return createAction(GET_ARCHIVED_MAILOUTS_SUCCESS, payload);
}

export function getArchivedMailoutsError(error) {
  return createErrorAction(GET_ARCHIVED_MAILOUTS_SUCCESS, error);
}

export function getMoreArchivedMailoutsPending(payload) {
  return createAction(GET_MORE_ARCHIVED_MAILOUTS_PENDING, payload);
}

export function getMoreArchivedMailoutsSuccess(payload) {
  return createAction(GET_MORE_ARCHIVED_MAILOUTS_SUCCESS, payload);
}

export function getMoreArchivedMailoutsError(error) {
  return createErrorAction(GET_MORE_ARCHIVED_MAILOUTS_SUCCESS, error);
}

export function addCampaignStart(payload) {
  return createAction(ADD_CAMPAIGN_START, payload);
}

export function addCampaignSuccess(payload) {
  return createAction(ADD_CAMPAIGN_SUCCESS, payload);
}

export function addCampaignError(error) {
  return createErrorAction(ADD_CAMPAIGN_ERROR, error);
}

export function addCampaignReset() {
  return createAction(ADD_CAMPAIGN_RESET);
}

export function addHolidayCampaignStart(payload) {
  return createAction(ADD_HOLIDAY_CAMPAIGN_START, payload);
}

export function addHolidayCampaignSuccess(payload) {
  return createAction(ADD_HOLIDAY_CAMPAIGN_SUCCESS, payload);
}

export function addHolidayCampaignError() {
  return createAction(ADD_HOLIDAY_CAMPAIGN_ERROR);
}

export function setMailoutsError(error) {
  return createAction(SET_MAILOUTS_ERROR, error);
}

export function clearMailoutsError() {
  return createAction(SET_MAILOUTS_ERROR);
}

export function showAddCampaignModal() {
  return createAction(SHOW_ADD_CAMPAIGN_MODAL);
}

export function hideAddCampaignModal() {
  return createAction(HIDE_ADD_CAMPAIGN_MODAL);
}

export function getFilteredMailoutsSuccess(payload) {
  return createAction(GET_FILTERED_MAILOUTS_SUCCESS, payload);
}

export function getFilteredMailoutsPending(payload) {
  return createAction(GET_FILTERED_MAILOUTS_PENDING, payload);
}

export function getFilteredMailoutsError(error) {
  return createAction(GET_FILTERED_MAILOUTS_ERROR, error);
}
