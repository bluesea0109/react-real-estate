import { put, call, takeLatest } from 'redux-saga/effects';

import { AUTHENTICATION_SUCCESS, COOKIE_AUTHENTICATION } from '../auth0/actions';
import { getOnLoginPending, getOnLoginSuccess, getOnLoginError } from './actions';
import ApiService from '../../../services/api/index';

export function* onLoginSaga() {
  try {
    yield put(getOnLoginPending());

    const { path, method } = ApiService.directory.onLogin();
    const response = yield call(ApiService[method], path);

    yield put(getOnLoginSuccess(response));
  } catch (err) {
    yield put(getOnLoginError(err.message));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_SUCCESS, onLoginSaga);
  yield takeLatest(COOKIE_AUTHENTICATION, onLoginSaga);
}
