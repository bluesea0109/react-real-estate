import { put, call, select, takeLatest } from 'redux-saga/effects';

import { fetchTeamPending, fetchTeamSuccess, fetchTeamError } from './actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';

import ApiService from '../../../services/api/index';

export const getOnLoginMode = state => state.onLogin.mode;

export function* fetchTeamSaga() {
  try {
    yield put(fetchTeamPending());

    const { path, method } = ApiService.directory.user.team.list();
    const response = yield call(ApiService[method], path);

    yield put(fetchTeamSuccess(response));
  } catch (err) {
    yield put(fetchTeamError(err));
  }
}

export function* checkIfMultiUser() {
  const mode = yield select(getOnLoginMode);

  if (mode === 'multiuser') {
    yield fetchTeamSaga();
  }
}

export default function*() {
  yield takeLatest(GET_ON_LOGIN_SUCCESS, checkIfMultiUser);
}
