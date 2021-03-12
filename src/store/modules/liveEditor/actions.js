import { createAction } from '../../utils/helpers';

export const SET_RELOAD_IFRAMES = 'SET_RELOAD_IFRAMES';
export const SET_RELOAD_IFRAMES_PENDING = 'SET_RELOAD_IFRAMES_PENDING';
export const SET_BRAND_COLOR_OPEN = 'SET_BRAND_COLOR_OPEN';
export const SET_POSTCARD_SIZE_OPEN = 'SET_POSTCARD_SIZE_OPEN';
export const SET_PHOTOS_OPEN = 'SET_PHOTOS_OPEN';
export const SET_AGENT_OPEN = 'SET_AGENT_OPEN';
export const SET_CUSTOM_CTA_OPEN = 'SET_CUSTOM_CTA_OPEN';
export const SET_CUSTOM_UPLOAD_URL = 'SET_CUSTOM_UPLOAD_URL';
export const SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN';
export const SET_LIVE_EDIT_FIELDS = 'SET_LIVE_EDIT_FIELDS';
export const SET_LIVE_EDIT_BRAND_COLOR = 'SET_LIVE_EDIT_BRAND_COLOR';

export function setReloadIframes(payload) {
  return createAction(SET_RELOAD_IFRAMES, payload);
}

export function setReloadIframesPending(payload) {
  return createAction(SET_RELOAD_IFRAMES_PENDING, payload);
}

export function setBrandColorOpen(payload) {
  return createAction(SET_BRAND_COLOR_OPEN, payload);
}

export function setPostcardSizeOpen(payload) {
  return createAction(SET_POSTCARD_SIZE_OPEN, payload);
}

export function setPhotosOpen(payload) {
  return createAction(SET_PHOTOS_OPEN, payload);
}

export function setAgentOpen(payload) {
  return createAction(SET_AGENT_OPEN, payload);
}

export function setCustomCtaOpen(payload) {
  return createAction(SET_CUSTOM_CTA_OPEN, payload);
}

export function setCustomUploadURL(payload) {
  return createAction(SET_CUSTOM_UPLOAD_URL, payload);
}

export function setSidebarOpen(payload) {
  return createAction(SET_SIDEBAR_OPEN, payload);
}

export function setLiveEditFields(payload) {
  return createAction(SET_LIVE_EDIT_FIELDS, payload);
}

export function setLiveEditBrandColor(payload) {
  return createAction(SET_LIVE_EDIT_BRAND_COLOR, payload);
}
