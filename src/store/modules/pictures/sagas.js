import { put, call, select, takeLatest } from 'redux-saga/effects';

import { UPLOAD_PHOTO_PENDING, uploadPhotoSuccess, uploadPhotoError } from './actions';

import ApiService from '../../../services/api/index';

export const getPhotoSrc = state => state.pictures.binarySource;
const s3BucketURL = 'https://alf-gabbi-uploads.s3.amazonaws.com/';

export function* uploadPhotoSaga() {
  try {
    const targetArr = yield select(getPhotoSrc);

    const targetKey = targetArr[0];
    const targetFile = targetArr[1];

    const { path, method } = yield targetKey === 'realtorPhoto'
      ? ApiService.directory.user.settings.photos.set()
      : targetKey === 'teamLogo'
      ? ApiService.directory.user.team.settings.photos.teamLogo.set()
      : targetKey === 'brokerageLogo'
      ? ApiService.directory.user.team.settings.photos.brokerageLogo.set()
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

export default function*() {
  yield takeLatest(UPLOAD_PHOTO_PENDING, uploadPhotoSaga);
}
