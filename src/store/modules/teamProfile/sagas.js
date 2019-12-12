import { put, call, select, takeLatest } from 'redux-saga/effects';

import { SAVE_TEAM_PROFILE_PENDING, saveTeamProfileSuccess, saveTeamProfileError } from './actions';
import ApiService from '../../../services/api/index';

export const teamProfileToSave = state => state.teamProfile.toSave;
export const teamProfileRev = state => state.onLogin.teamProfile && state.onLogin.teamProfile._rev;

export function* saveTeamProfileSaga() {
  try {
    const teamProfile = yield select(teamProfileToSave);
    const _rev = yield select(teamProfileRev);
    const revisedTeamProfile = Object.assign({}, teamProfile, { _rev });

    const { path, method } = ApiService.directory.onboard.fillInYourProfile.teamProfile.save();
    const response = yield call(ApiService[method], path, revisedTeamProfile);

    yield put(saveTeamProfileSuccess(response));
  } catch (err) {
    yield put(saveTeamProfileError(err.message));
  }
}

export default function*() {
  yield takeLatest(SAVE_TEAM_PROFILE_PENDING, saveTeamProfileSaga);
}
