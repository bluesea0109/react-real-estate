import { put, call, takeLatest } from 'redux-saga/effects';

import AuthService from '../../../services/auth';
// import ApiService from '../../../services/api';
import { HANDLE_AUTHENTICATION_CALLBACK, USER_PROFILE_LOADED } from './actions';

export function* parseHash() {
  const auth0User = yield call(AuthService.handleAuthentication);

  // const apiUser = yield call(ApiService.user.onLogin.get);

  const user = Object.assign({ authenticated: true }, auth0User);

  yield put({ type: USER_PROFILE_LOADED, user });
}

export default function*() {
  yield takeLatest(HANDLE_AUTHENTICATION_CALLBACK, parseHash);
}
