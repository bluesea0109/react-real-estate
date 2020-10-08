import { put, call, select, takeLatest } from 'redux-saga/effects';

import { getTeamPending, getTeamSuccess, getTeamError, SYNC_PENDING, syncSuccess, syncError } from './actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';

import ApiService from '../../../services/api/index';

export const getOnLoginMode = state => state.onLogin.mode;

export function* getTeamSaga() {
  try {
    yield put(getTeamPending());

    const { path, method } = ApiService.directory.team.list();
    const response = yield call(ApiService[method], path, { include_realtorPhoto: true, include_docs: true });

    yield put(getTeamSuccess(response));
  } catch (err) {
    yield put(getTeamError(err));
  }
}

export function* syncTeamSaga() {
  try {
    const { path, method } = ApiService.directory.team.sync();
    const response = yield call(ApiService[method], path);

    const t = new Date();
    const z = t.getTimezoneOffset() * 60 * 1000; // convert the local time zone offset from minutes to milliseconds
    let tLocal = t - z; // subtract the offset from t
    tLocal = new Date(tLocal); // create shifted Date object
    let iso = tLocal.toISOString(); //convert to ISO format string
    iso = iso.slice(0, 19); // drop the milliseconds and zone
    iso = iso.replace('T', ' '); // replace the ugly 'T' with a space

    if (response.ok) response.lastSuccessfulSync = iso;

    yield put(syncSuccess(response));
  } catch (err) {
    yield put(syncError(err));
  }
}

export function* checkIfMultiUser() {
  const mode = yield select(getOnLoginMode);

  if (mode === 'multiuser') {
    yield getTeamSaga();
  }
}

export default function*() {
  yield takeLatest(GET_ON_LOGIN_SUCCESS, checkIfMultiUser);
  yield takeLatest(SYNC_PENDING, syncTeamSaga);
}
