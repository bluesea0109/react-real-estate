import { put, call, delay, take, race, select } from 'redux-saga/effects';

import {
  INITIALIZE_USER_POLLING_START,
  INITIALIZE_USER_POLLING_STOP,
  initializeUserPending,
  initializeUserSuccess,
  initializeUserError,
  initializeUserPollingStop,
} from './actions';
import { getMailoutsPending } from '../mailouts/actions';

import ApiService from '../../../services/api/index';

export const getCurrentUserId = state => state.onLogin.user && state.onLogin.user._id;
export const getPeerUserId = state => state.onLogin.user && state.peer.peerId;

export function* initializeUserPollSagaWorker() {
  while (true) {
    try {
      const peerId = yield select(getPeerUserId);

      yield put(initializeUserPending());

      const { path, method } = peerId ? ApiService.directory.peer.listing.poll(peerId) : ApiService.directory.user.listing.poll();
      const response = yield call(ApiService[method], path);

      const { campaignsTotal, campaignsCompleted } = response;

      yield put(initializeUserSuccess(response));
      if (campaignsTotal !== campaignsCompleted) yield put(getMailoutsPending());
      if (campaignsTotal === campaignsCompleted) yield put(initializeUserPollingStop());
      yield delay(2000);
    } catch (err) {
      yield put(initializeUserError(err));
      yield put(initializeUserPollingStop());
    }
  }
}

export default function* initializeUserPollSagaWatcher() {
  while (true) {
    yield take(INITIALIZE_USER_POLLING_START);
    yield race([call(initializeUserPollSagaWorker), take(INITIALIZE_USER_POLLING_STOP)]);
  }
}
