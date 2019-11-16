import { put, call, takeLatest } from 'redux-saga/effects';

import AuthService from '../../../services/auth';
import { HANDLE_AUTHENTICATION_CALLBACK, USER_PROFILE_LOADED } from './actions';

export function* parseHash() {
  const auth0User = yield call(AuthService.handleAuthentication);
  AuthService.localLogin(auth0User);

  const user = Object.assign({}, auth0User);

  yield put({ type: USER_PROFILE_LOADED, user });
}

export default function*() {
  yield takeLatest(HANDLE_AUTHENTICATION_CALLBACK, parseHash);
}
