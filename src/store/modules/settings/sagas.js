import { put, call, takeLatest } from 'redux-saga/effects';

import {
  GET_USER_SETTINGS_PENDING,
  getUserSettingsBrandingSuccess,
  getUserSettingsBrandingError,
  getUserSettingsPhotoSuccess,
  getUserSettingsPhotoError,
  getUserSettingsProfileSuccess,
  getUserSettingsProfileError,
  GET_PEER_SETTINGS_PENDING,
  getPeerSettingsBrandingSuccess,
  getPeerSettingsBrandingError,
  getPeerSettingsPhotoSuccess,
  getPeerSettingsPhotoError,
  getPeerSettingsProfileSuccess,
  getPeerSettingsProfileError,
} from './actions';
import ApiService from '../../../services/api/index';

export function* userSettingsBrandingSaga() {
  try {
    const { path, method } = ApiService.directory.user.settings.branding.get();
    const response = yield call(ApiService[method], path);

    yield put(getUserSettingsBrandingSuccess(response));
  } catch (err) {
    yield put(getUserSettingsBrandingError(err.message));
  }
}

export function* userSettingsPhotosSaga() {
  try {
    const { path, method } = ApiService.directory.user.settings.photos.get();
    const response = yield call(ApiService[method], path);

    yield put(getUserSettingsPhotoSuccess(response));
  } catch (err) {
    yield put(getUserSettingsPhotoError(err.message));
  }
}

export function* userSettingsProfileSaga() {
  try {
    const { path, method } = ApiService.directory.user.settings.profile.get();
    const response = yield call(ApiService[method], path);

    yield put(getUserSettingsProfileSuccess(response));
  } catch (err) {
    yield put(getUserSettingsProfileError(err.message));
  }
}

export function* userSettingsSaga() {
  yield userSettingsBrandingSaga();
  yield userSettingsPhotosSaga();
  yield userSettingsProfileSaga();
}

export function* peerSettingsBrandingSaga() {
  try {
    const { path, method } = ApiService.directory.user.peer.settings.branding.get();
    const response = yield call(ApiService[method], path);

    yield put(getPeerSettingsBrandingSuccess(response));
  } catch (err) {
    yield put(getPeerSettingsBrandingError(err.message));
  }
}

export function* peerSettingsPhotosSaga() {
  try {
    const { path, method } = ApiService.directory.user.peer.settings.photos.get();
    const response = yield call(ApiService[method], path);

    yield put(getPeerSettingsPhotoSuccess(response));
  } catch (err) {
    yield put(getPeerSettingsPhotoError(err.message));
  }
}

export function* peerSettingsProfileSaga() {
  try {
    const { path, method } = ApiService.directory.user.peer.settings.profile.get();
    const response = yield call(ApiService[method], path);

    yield put(getPeerSettingsProfileSuccess(response));
  } catch (err) {
    yield put(getPeerSettingsProfileError(err.message));
  }
}

export function* peerSettingsSaga() {
  yield peerSettingsBrandingSaga();
  yield peerSettingsPhotosSaga();
  yield peerSettingsProfileSaga();
}

export default function*() {
  yield takeLatest(GET_USER_SETTINGS_PENDING, userSettingsSaga);
  yield takeLatest(GET_PEER_SETTINGS_PENDING, peerSettingsSaga);
}
