import { put, call, takeLatest, select } from 'redux-saga/effects';

import {
  AUTHENTICATION_PENDING,
  authenticationSuccess,
  authenticationError,
  PASSWORD_RESET_PENDING,
  passwordResetSuccess,
  passwordResetError,
} from './actions';
import AuthService from '../../../services/auth';
import ApiService from '../../../services/api';

export const getSelectedPeerId = state => state.peer.peerId;

export function* parseHash() {
  try {
    const localToken = localStorage.getItem('localToken');
    if (localToken) {
      yield put(authenticationSuccess(localToken));
    } else {
      const auth0 = yield call(AuthService.handleAuthentication);
      yield put(authenticationSuccess(auth0));
    }
  } catch (err) {
    yield put(authenticationError(err));
  }
}

export function* passwordResetSaga({ peerId = null }) {
  try {
    const { path, method } = peerId
      ? ApiService.directory.peer.password.reset(peerId)
      : ApiService.directory.user.password.reset();
    const response = yield call(ApiService[method], path);

    yield put(passwordResetSuccess(response));
  } catch (err) {
    yield put(passwordResetError(err));
  }
}

export function* checkIfPeerSelectedPasswordResetSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield passwordResetSaga({ peerId });
  } else {
    yield passwordResetSaga({});
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_PENDING, parseHash);
  yield takeLatest(PASSWORD_RESET_PENDING, checkIfPeerSelectedPasswordResetSaga);
}
