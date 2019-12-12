import { put, call, select, takeLatest } from 'redux-saga/effects';

import { SAVE_TEAM_PROFILE_PENDING, saveTeamProfileSuccess, saveTeamProfileError } from './actions';
import ApiService from '../../../services/api/index';

export const teamProfileToSave = state => state.teamProfile.toSave;

export function* saveTeamProfileSaga() {
  try {
    const teamProfile = yield select(teamProfileToSave);

    const { path, method } = ApiService.directory.onboard.fillInYourProfile.teamProfile.save();
    const response = yield call(ApiService[method], path, teamProfile);

    yield put(saveTeamProfileSuccess(response));
  } catch (err) {
    yield put(saveTeamProfileError(err.message));
  }
}

export default function*() {
  yield takeLatest(SAVE_TEAM_PROFILE_PENDING, saveTeamProfileSaga);
}
