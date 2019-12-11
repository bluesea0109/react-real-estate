import { put, call, select, takeLatest } from 'redux-saga/effects';

import { SAVE_PROFILE_PENDING, saveProfileSuccess, saveProfileError } from './actions';
import ApiService from '../../../services/api/index';

export const profileToSave = state => state.profile.toSave;

export function* saveProfileSaga() {
  try {
    const profile = yield select(profileToSave);

    const { path, method } = ApiService.directory.onboard.fillInYourProfile.profile.save();
    const response = yield call(ApiService[method], path, profile);

    yield put(saveProfileSuccess(response));
  } catch (err) {
    yield put(saveProfileError(err.message));
  }
}

export default function*() {
  yield takeLatest(SAVE_PROFILE_PENDING, saveProfileSaga);
}
