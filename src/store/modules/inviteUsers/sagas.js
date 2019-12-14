import { put, call, select, takeLatest } from 'redux-saga/effects';

import { INVITE_USERS_PENDING, inviteUsersSuccess, inviteUsersError } from './actions';

import ApiService from '../../../services/api/index';

import { setCompletedInviteTeammates, setOnboardedStatus } from '../onboarded/actions';

export const getPeersToInvite = state => state.inviteUsers.peers;
export const getOnboardedStatus = state => state.onboarded.status;

export function* inviteUsersSaga() {
  try {
    const peersToInvite = yield select(getPeersToInvite);

    const { path, method } = ApiService.directory.onboard.inviteUsers.send();
    const response = yield call(ApiService[method], path, peersToInvite);

    yield put(inviteUsersSuccess(response));

    const isOnboarded = yield select(getOnboardedStatus);
    if (!isOnboarded) yield put(setCompletedInviteTeammates(true));
    if (!isOnboarded) yield put(setOnboardedStatus(true));
  } catch (err) {
    yield put(inviteUsersError(err.message));
  }
}

export default function*() {
  yield takeLatest(INVITE_USERS_PENDING, inviteUsersSaga);
}
