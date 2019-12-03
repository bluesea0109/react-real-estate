import { createAction, createErrorAction } from '../../helpers';

export const GET_ALL_PHOTOS_PENDING = 'GET_ALL_PHOTOS_PENDING';
export const GET_ALL_PHOTOS_SUCCESS = 'GET_ALL_PHOTOS_SUCCESS';
export const GET_ALL_PHOTOS_ERROR = 'GET_ALL_PHOTOS_ERROR';

export const UPLOAD_PHOTO_PENDING = 'UPLOAD_PHOTO_PENDING';
export const UPLOAD_PHOTO_SUCCESS = 'UPLOAD_PHOTO_SUCCESS';
export const UPLOAD_PHOTO_ERROR = 'UPLOAD_PHOTO_ERROR';

export function getAllPhotosPending() {
  return createAction(GET_ALL_PHOTOS_PENDING);
}

export function getAllPhotosSuccess(payload) {
  return createAction(GET_ALL_PHOTOS_SUCCESS, payload);
}

export function getAllPhotosError(error) {
  return createErrorAction(GET_ALL_PHOTOS_ERROR, error);
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
