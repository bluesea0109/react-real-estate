import { put, call, takeLatest } from 'redux-saga/effects';

import { AUTHENTICATION_SUCCESS } from '../auth0/actions';
import { fetchOnLoginPending, fetchOnLoginSuccess, fetchOnLoginError } from './actions';
import ApiService from '../../../services/api/index';

export function* onLoginSaga() {
  try {
    yield put(fetchOnLoginPending());

    const { path, method } = ApiService.directory.user.onLogin();
    const response = yield call(ApiService[method], path);

    yield put(fetchOnLoginSuccess(response));
  } catch (err) {
    yield put(fetchOnLoginError(err));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_SUCCESS, onLoginSaga);
}
