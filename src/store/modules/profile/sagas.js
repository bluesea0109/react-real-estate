import { put, call, select, takeLatest } from 'redux-saga/effects';

import { AUTHENTICATION_SUCCESS } from '../auth0/actions';
import { getProfilePending, getProfileSuccess, getProfileError, SAVE_PROFILE_PENDING, saveProfileSuccess, saveProfileError } from './actions';
import ApiService from '../../../services/api/index';

export const profileToSave = state => state.profile.toSave;

export function* onLoginGetProfileSaga() {
  try {
    yield put(getProfilePending());

    const { path, method } = ApiService.directory.user.settings.profile.get();
    const response = yield call(ApiService[method], path);

    delete response._id;
    delete response._rev;

    yield put(getProfileSuccess(response));
  } catch (err) {
    yield put(getProfileError(err.message));
  }
}

export function* saveProfileSaga() {
  try {
    const profile = yield select(profileToSave);

    const { path, method } = ApiService.directory.user.settings.profile.save();
    const response = yield call(ApiService[method], path, profile);

    delete response._id;
    delete response._rev;

    yield put(saveProfileSuccess(response));
  } catch (err) {
    yield put(saveProfileError(err.message));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_SUCCESS, onLoginGetProfileSaga);
  yield takeLatest(SAVE_PROFILE_PENDING, saveProfileSaga);
}
