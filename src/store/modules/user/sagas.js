import { all, put, call, takeLatest } from 'redux-saga/effects';

import { handleAuthentication } from '../../../services/Auth0';
import { HANDLE_AUTHENTICATION_CALLBACK, USER_PROFILE_LOADED } from './actions';

export function* parseHash() {
  const user = yield call(handleAuthentication);

  yield put({ type: USER_PROFILE_LOADED, user });
}

export function* authSagas() {
  yield all([yield takeLatest(HANDLE_AUTHENTICATION_CALLBACK, parseHash)]);
}
