import { createAction, createErrorAction } from '../../helpers';

export const GET_USER_SETTINGS_PENDING = 'GET_USER_SETTINGS_PENDING';
export const GET_USER_SETTINGS_BRANDING_SUCCESS = 'GET_USER_SETTINGS_BRANDING_SUCCESS';
export const GET_USER_SETTINGS_BRANDING_ERROR = 'GET_USER_SETTINGS_BRANDING_ERROR';
export const GET_USER_SETTINGS_PHOTO_SUCCESS = 'GET_USER_SETTINGS_PHOTO_SUCCESS';
export const GET_USER_SETTINGS_PHOTO_ERROR = 'GET_USER_SETTINGS_PHOTO_ERROR';
export const GET_USER_SETTINGS_PROFILE_SUCCESS = 'GET_USER_SETTINGS_PROFILE_SUCCESS';
export const GET_USER_SETTINGS_PROFILE_ERROR = 'GET_USER_SETTINGS_PROFILE_ERROR';

export const GET_PEER_SETTINGS_PENDING = 'GET_PEER_SETTINGS_PENDING';
export const GET_PEER_SETTINGS_BRANDING_SUCCESS = 'GET_PEER_SETTINGS_BRANDING_SUCCESS';
export const GET_PEER_SETTINGS_BRANDING_ERROR = 'GET_PEER_SETTINGS_BRANDING_ERROR';
export const GET_PEER_SETTINGS_PHOTO_SUCCESS = 'GET_PEER_SETTINGS_PHOTO_SUCCESS';
export const GET_PEER_SETTINGS_PHOTO_ERROR = 'GET_PEER_SETTINGS_PHOTO_ERROR';
export const GET_PEER_SETTINGS_PROFILE_SUCCESS = 'GET_PEER_SETTINGS_PROFILE_SUCCESS';
export const GET_PEER_SETTINGS_PROFILE_ERROR = 'GET_PEER_SETTINGS_PROFILE_ERROR';

export function getUserSettingsPending() {
  return createAction(GET_USER_SETTINGS_PENDING);
}

export function getUserSettingsBrandingSuccess(payload) {
  return createAction(GET_USER_SETTINGS_BRANDING_SUCCESS, payload);
}

export function getUserSettingsBrandingError(error) {
  return createErrorAction(GET_USER_SETTINGS_BRANDING_ERROR, error);
}

export function getUserSettingsPhotoSuccess(payload) {
  return createAction(GET_USER_SETTINGS_PHOTO_SUCCESS, payload);
}

export function getUserSettingsPhotoError(error) {
  return createErrorAction(GET_USER_SETTINGS_PHOTO_ERROR, error);
}

export function getUserSettingsProfileSuccess(payload) {
  return createAction(GET_USER_SETTINGS_PROFILE_SUCCESS, payload);
}

export function getUserSettingsProfileError(error) {
  return createErrorAction(GET_USER_SETTINGS_PROFILE_ERROR, error);
}

export function getPeerSettingsPending() {
  return createAction(GET_PEER_SETTINGS_PENDING);
}

export function getPeerSettingsBrandingSuccess(payload) {
  return createAction(GET_PEER_SETTINGS_BRANDING_SUCCESS, payload);
}

export function getPeerSettingsBrandingError(error) {
  return createErrorAction(GET_PEER_SETTINGS_BRANDING_ERROR, error);
}

export function getPeerSettingsPhotoSuccess(payload) {
  return createAction(GET_PEER_SETTINGS_PHOTO_SUCCESS, payload);
}

export function getPeerSettingsPhotoError(error) {
  return createErrorAction(GET_PEER_SETTINGS_PHOTO_ERROR, error);
}

export function getPeerSettingsProfileSuccess(payload) {
  return createAction(GET_PEER_SETTINGS_PROFILE_SUCCESS, payload);
}

export function getPeerSettingsProfileError(error) {
  return createErrorAction(GET_PEER_SETTINGS_PROFILE_ERROR, error);
}
