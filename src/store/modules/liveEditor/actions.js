import { createAction } from '../../utils/helpers';

export const SET_RELOAD_IFRAMES = 'RELOAD_IFRAMES';
export const SET_RELOAD_IFRAMES_PENDING = 'RELOAD_IFRAMES_PENDING';

export function setReloadIframes(payload) {
  return createAction(SET_RELOAD_IFRAMES, payload);
}

export function setReloadIframesPending(payload) {
  return createAction(SET_RELOAD_IFRAMES_PENDING, payload);
}
