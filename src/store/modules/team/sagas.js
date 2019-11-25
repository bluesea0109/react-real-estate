import { put, call, select, takeLatest } from 'redux-saga/effects';

import { getTeamPending, getTeamSuccess, getTeamError } from './actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';

import ApiService from '../../../services/api/index';

export const getOnLoginMode = state => state.onLogin.mode;

export function* getTeamSaga() {
  try {
    yield put(getTeamPending());

    const { path, method } = ApiService.directory.user.team.list();
    const response = yield call(ApiService[method], path);

    yield put(getTeamSuccess(response));
  } catch (err) {
    yield put(getTeamError(err.message));
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
}
