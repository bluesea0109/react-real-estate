import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  GET_TEAM_PROFILE_PENDING,
  getTeamProfileSuccess,
  getTeamProfileError,
  SAVE_TEAM_PROFILE_PENDING,
  saveTeamProfileSuccess,
  saveTeamProfileError,
} from './actions';
import ApiService from '../../../services/api/index';

export const teamProfileToSave = state => state.teamProfile.toSave;
export const teamProfileRev = state => state.onLogin.teamProfile && state.onLogin.teamProfile._rev;

export function* getTeamProfileSaga() {
  try {
    const { path, method } = ApiService.directory.team.profile.get();
    const response = yield call(ApiService[method], path);

    yield put(getTeamProfileSuccess(response));
  } catch (err) {
    yield put(getTeamProfileError(err.message));
  }
}

export function* saveTeamProfileSaga() {
  try {
    const teamProfile = yield select(teamProfileToSave);
    const _rev = yield select(teamProfileRev);
    const revisedTeamProfile = Object.assign({}, teamProfile, { _rev });

    const { path, method } = ApiService.directory.team.profile.save();
    const response = yield call(ApiService[method], path, revisedTeamProfile);

    yield put(saveTeamProfileSuccess(response));
  } catch (err) {
    yield put(saveTeamProfileError(err.message));
  }
}

export default function*() {
  yield takeLatest(GET_TEAM_PROFILE_PENDING, getTeamProfileSaga);
  yield takeLatest(SAVE_TEAM_PROFILE_PENDING, saveTeamProfileSaga);
}
