import { put, call, select, takeLatest } from 'redux-saga/effects';

import { INVITE_USERS_PENDING, inviteUsersSuccess, inviteUsersError } from './actions';

import ApiService from '../../../services/api/index';

export const getPeersToInvite = state => state.inviteUsers.peers;

export function* inviteUsersSaga() {
  try {
    const peersToInvite = yield select(getPeersToInvite);

    const { path, method } = ApiService.directory.onboard.inviteUsers.send();
    const response = yield call(ApiService[method], path, peersToInvite);

    yield put(inviteUsersSuccess(response));
  } catch (err) {
    yield put(inviteUsersError(err));
  }
}

export default function*() {
  yield takeLatest(INVITE_USERS_PENDING, inviteUsersSaga);
}
