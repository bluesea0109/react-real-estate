import { createAction, createErrorAction } from '../../utils/helpers';

export const GET_PHOTO_PENDING = 'GET_PHOTO_PENDING';
export const GET_PHOTO_SUCCESS = 'GET_PHOTO_SUCCESS';
export const GET_PHOTO_ERROR = 'GET_PHOTO_ERROR';

export const UPLOAD_PHOTO_PENDING = 'UPLOAD_PHOTO_PENDING';
export const UPLOAD_PHOTO_SUCCESS = 'UPLOAD_PHOTO_SUCCESS';
export const UPLOAD_PHOTO_ERROR = 'UPLOAD_PHOTO_ERROR';

export const DELETE_PHOTO_PENDING = 'DELETE_PHOTO_PENDING';
export const DELETE_PHOTO_SUCCESS = 'DELETE_PHOTO_SUCCESS';
export const DELETE_PHOTO_ERROR = 'DELETE_PHOTO_ERROR';

export function getPhotoPending() {
  return createAction(GET_PHOTO_PENDING);
}

export function getPhotoSuccess(payload) {
  return createAction(GET_PHOTO_SUCCESS, payload);
}

export function getPhotoError(error) {
  return createErrorAction(GET_PHOTO_ERROR, error);
}

export function uploadPhotoPending(payload) {
  return createAction(UPLOAD_PHOTO_PENDING, payload);
}

export function uploadPhotoSuccess(payload) {
  return createAction(UPLOAD_PHOTO_SUCCESS, payload);
}

export function uploadPhotoError(error) {
  return createErrorAction(UPLOAD_PHOTO_ERROR, error);
}

export function deletePhotoPending(payload) {
  return createAction(DELETE_PHOTO_PENDING, payload);
}

export function deletePhotoSuccess(payload) {
  return createAction(DELETE_PHOTO_SUCCESS, payload);
}

export function deletePhotoError(error) {
  return createErrorAction(DELETE_PHOTO_ERROR, error);
}
