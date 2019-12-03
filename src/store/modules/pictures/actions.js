import { createAction, createErrorAction } from '../../helpers';

export const UPLOAD_PHOTO_PENDING = 'UPLOAD_PHOTO_PENDING';
export const UPLOAD_PHOTO_SUCCESS = 'UPLOAD_PHOTO_SUCCESS';
export const UPLOAD_PHOTO_ERROR = 'UPLOAD_PHOTO_ERROR';

export function uploadPhotoPending(payload) {
  return createAction(UPLOAD_PHOTO_PENDING, payload);
}

export function uploadPhotoSuccess(payload) {
  return createAction(UPLOAD_PHOTO_SUCCESS, payload);
}

export function uploadPhotoError(error) {
  return createErrorAction(UPLOAD_PHOTO_ERROR, error);
}
