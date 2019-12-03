import { put, call, select, takeLatest } from 'redux-saga/effects';

import { getAllPhotosPending, getAllPhotosSuccess, getAllPhotosError, UPLOAD_PHOTO_PENDING, uploadPhotoSuccess, uploadPhotoError } from './actions';

import ApiService from '../../../services/api/index';

export const getPhotoSrc = state => state.pictures.binarySource;

export function* getAllPhotosSaga() {
  try {
    yield put(getAllPhotosPending());

    const { path, method } = ApiService.directory.user.team.settings.photos.get();
    const response = yield call(ApiService[method], path);

    yield put(getAllPhotosSuccess(response));
  } catch (err) {
    yield put(getAllPhotosError(err.message));
  }
}

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

    yield put(uploadPhotoSuccess(response));
    yield getAllPhotosSaga();
  } catch (err) {
    yield put(uploadPhotoError(err.message));
  }
}

export default function*() {
  yield takeLatest(UPLOAD_PHOTO_PENDING, uploadPhotoSaga);
}
