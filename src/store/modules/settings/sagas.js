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
  console.log('User Settings Branding Saga Start');
  try {
    const { path, method } = ApiService.directory.user.settings.branding.get();
    const response = yield call(ApiService[method], path);

    yield put(getUserSettingsBrandingSuccess(response));
  } catch (err) {
    yield put(getUserSettingsBrandingError(err));
  }
}

export function* userSettingsPhotosSaga() {
  console.log('User Settings Photos Saga Start');
  try {
    const { path, method } = ApiService.directory.user.settings.photos.get();
    const response = yield call(ApiService[method], path);

    yield put(getUserSettingsPhotoSuccess(response));
  } catch (err) {
    yield put(getUserSettingsPhotoError(err));
  }
}

export function* userSettingsProfileSaga() {
  console.log('User Settings Profile Saga Start');
  try {
    const { path, method } = ApiService.directory.user.settings.profile;
    const response = yield call(ApiService[method], path);

    yield put(getUserSettingsProfileSuccess(response));
  } catch (err) {
    yield put(getUserSettingsProfileError(err));
  }
}

export function* userSettingsSaga() {
  console.log('User Settings Saga Start');
  yield userSettingsBrandingSaga();
  yield userSettingsPhotosSaga();
  yield userSettingsProfileSaga();
}

export function* peerSettingsBrandingSaga() {
  console.log('Peer Settings Branding Saga Start');
  try {
    const { path, method } = ApiService.directory.user.peer.settings.branding.get();
    const response = yield call(ApiService[method], path);

    yield put(getPeerSettingsBrandingSuccess(response));
  } catch (err) {
    yield put(getPeerSettingsBrandingError(err));
  }
}

export function* peerSettingsPhotosSaga() {
  console.log('Peer Settings Photos Saga Start');
  try {
    const { path, method } = ApiService.directory.user.peer.settings.photos.get();
    const response = yield call(ApiService[method], path);

    yield put(getPeerSettingsPhotoSuccess(response));
  } catch (err) {
    yield put(getPeerSettingsPhotoError(err));
  }
}

export function* peerSettingsProfileSaga() {
  console.log('Peer Settings Profile Saga Start');
  try {
    const { path, method } = ApiService.directory.user.peer.settings.profile;
    const response = yield call(ApiService[method], path);

    yield put(getPeerSettingsProfileSuccess(response));
  } catch (err) {
    yield put(getPeerSettingsProfileError(err));
  }
}

export function* peerSettingsSaga() {
  console.log('User Settings Saga Start');
  yield peerSettingsBrandingSaga();
  yield peerSettingsPhotosSaga();
  yield peerSettingsProfileSaga();
}

export default function*() {
  yield takeLatest(GET_USER_SETTINGS_PENDING, userSettingsSaga);
  yield takeLatest(GET_PEER_SETTINGS_PENDING, peerSettingsSaga);
}
