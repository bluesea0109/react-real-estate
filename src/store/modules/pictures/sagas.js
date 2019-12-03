import { put, call, select, takeLatest } from 'redux-saga/effects';

import { UPLOAD_PHOTO_PENDING, uploadPhotoSuccess, uploadPhotoError } from './actions';

import ApiService from '../../../services/api/index';

export const getPhotoSrc = state => state.pictures.binarySource;

export function* uploadPhotoSaga() {
  try {
    const file = yield select(getPhotoSrc);

    const formData = [...file];
    const formDataKeyName = formData[0][0];

    console.log('formDataKeyName', formDataKeyName);

    // type: realtorPhoto /

    const { path, method } =
      formDataKeyName === 'realtorPhoto'
        ? ApiService.directory.user.settings.photos.set()
        : formDataKeyName === 'teamLogo'
        ? ApiService.directory.user.profile.branding.teamLogo.set()
        : formDataKeyName === 'brokerageLogo'
        ? ApiService.directory.user.profile.branding.brokerageLogo.set()
        : {};

    const response = yield call(ApiService[method], path, file);

    yield put(uploadPhotoSuccess(response));
  } catch (err) {
    yield put(uploadPhotoError(err.message));
  }
}

export default function*() {
  yield takeLatest(UPLOAD_PHOTO_PENDING, uploadPhotoSaga);
}
