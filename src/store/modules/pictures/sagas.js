import { put, call, select, takeLatest } from 'redux-saga/effects';

import { UPLOAD_PHOTO_PENDING, uploadPhotoSuccess, uploadPhotoError, DELETE_PHOTO_PENDING, deletePhotoSuccess, deletePhotoError } from './actions';

import ApiService from '../../../services/api/index';

export const getPhotoToUpload = state => state.pictures.toUpload;
export const getPhotoToDelete = state => state.pictures.toDelete;
const s3BucketURL = 'https://alf-gabbi-uploads.s3.amazonaws.com/';

export function* uploadPhotoSaga() {
  try {
    const targetArr = yield select(getPhotoToUpload);

    const targetKey = targetArr[0];
    const targetFile = targetArr[1];

    const { path, method } = yield targetKey === 'realtorPhoto'
      ? ApiService.directory.onboard.fillInYourProfile.photos.realtorPhoto.set()
      : targetKey === 'teamLogo'
      ? ApiService.directory.onboard.fillInYourProfile.photos.teamLogo.set()
      : targetKey === 'brokerageLogo'
      ? ApiService.directory.onboard.fillInYourProfile.photos.brokerageLogo.set()
      : {};

    const data = yield new FormData();
    data.append(targetKey, targetFile);

    const response = yield call(ApiService[method], path, data);
    const normalizedResponse = Object.assign({}, response, { resized: `${s3BucketURL}${response.resized}`, original: `${s3BucketURL}${response.original}` });

    yield put(uploadPhotoSuccess({ target: targetKey, data: normalizedResponse }));
  } catch (err) {
    yield put(uploadPhotoError(err.message));
  }
}

export function* deletePhotoSaga() {
  try {
    const target = yield select(getPhotoToDelete);

    const { path, method } = yield target === 'teamLogo' ? ApiService.directory.onboard.fillInYourProfile.photos.teamLogo.delete() : {};

    yield call(ApiService[method], path);

    yield put(deletePhotoSuccess({ target: target }));
  } catch (err) {
    yield put(deletePhotoError(err.message));
  }
}

export default function*() {
  yield takeLatest(UPLOAD_PHOTO_PENDING, uploadPhotoSaga);
  yield takeLatest(DELETE_PHOTO_PENDING, deletePhotoSaga);
}
