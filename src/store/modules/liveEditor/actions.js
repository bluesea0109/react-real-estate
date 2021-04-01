import { createAction } from '../../utils/helpers';

export const SET_RELOAD_IFRAMES = 'SET_RELOAD_IFRAMES';
export const SET_RELOAD_IFRAMES_PENDING = 'SET_RELOAD_IFRAMES_PENDING';
export const SET_REPLACE_FIELD_DATA = 'SET_REPLACE_FIELD_DATA';
export const SET_BRAND_COLOR_OPEN = 'SET_BRAND_COLOR_OPEN';
export const SET_POSTCARD_SIZE_OPEN = 'SET_POSTCARD_SIZE_OPEN';
export const SET_PHOTOS_OPEN = 'SET_PHOTOS_OPEN';
export const SET_AGENT_OPEN = 'SET_AGENT_OPEN';
export const SET_CUSTOM_CTA_OPEN = 'SET_CUSTOM_CTA_OPEN';
export const SET_CUSTOM_UPLOAD_URL = 'SET_CUSTOM_UPLOAD_URL';
export const SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN';
export const SET_LIVE_EDIT_FIELDS = 'SET_LIVE_EDIT_FIELDS';
export const SET_LIVE_EDIT_BRAND_COLOR = 'SET_LIVE_EDIT_BRAND_COLOR';
export const SET_SELECTED_PHOTO = 'SET_SELECTED_PHOTO';
export const SET_ZOOM_VALUE = 'SET_ZOOM_VALUE';
export const SET_SELECTED_TEMPLATE = 'SET_SELECTED_TEMPLATE';
export const SET_BIG_PHOTO = 'SET_BIG_PHOTO';
export const SET_EDITING_ELEMENT = 'SET_EDITING_ELEMENT';
export const SET_EDITING_PAGE = 'SET_EDITING_PAGE';
export const SET_CURRENT_STYLES = 'SET_CURRENT_STYLES';
export const SET_FONT_SIZE_VALUE = 'SET_FONT_SIZE_VALUE';
export const SET_STENCIL_EDITS = 'SET_STENCIL_EDITS';
export const UPDATE_ELEMENT_CSS = 'UPDATE_ELEMENT_CSS';
export const SET_ROTATION = 'SET_ROTATION';

export function setReloadIframes(payload) {
  return createAction(SET_RELOAD_IFRAMES, payload);
}

export function setReloadIframesPending(payload) {
  return createAction(SET_RELOAD_IFRAMES_PENDING, payload);
}

export function setReplaceFieldData(payload) {
  return createAction(SET_REPLACE_FIELD_DATA, payload);
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

export function setSelectedPhoto(payload) {
  return createAction(SET_SELECTED_PHOTO, payload);
}

export function setBigPhoto(payload) {
  return createAction(SET_BIG_PHOTO, payload);
}

export function setZoomValue(payload) {
  return createAction(SET_ZOOM_VALUE, payload);
}

export function setSelectedTemplate(payload) {
  return createAction(SET_SELECTED_TEMPLATE, payload);
}

export function setEditingElement(payload) {
  return createAction(SET_EDITING_ELEMENT, payload);
}

export function setEditingPage(payload) {
  return createAction(SET_EDITING_PAGE, payload);
}

export function setCurrentStyles(payload) {
  return createAction(SET_CURRENT_STYLES, payload);
}

export function setFontSize(payload) {
  return createAction(SET_FONT_SIZE_VALUE, payload);
}

export function setStencilEdits(payload) {
  return createAction(SET_STENCIL_EDITS, payload);
}

export function updateElementCss(payload) {
  return createAction(UPDATE_ELEMENT_CSS, payload);
}

export function setRotation(payload) {
  return createAction(SET_ROTATION, payload);
}
