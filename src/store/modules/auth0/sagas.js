import { put, call, takeLatest } from 'redux-saga/effects';

import { AUTHENTICATION_PENDING, authenticationSuccess, authenticationError } from './actions';
import AuthService from '../../../services/auth';

export function* parseHash() {
  try {
    const auth0 = yield call(AuthService.handleAuthentication);

    yield put(authenticationSuccess(auth0));
  } catch (err) {
    yield put(authenticationError(err.message));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_PENDING, parseHash);
}
