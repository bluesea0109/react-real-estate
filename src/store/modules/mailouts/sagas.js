import {
  GET_MAILOUTS_PENDING,
  getMailoutsSuccess,
  getMailoutsError,
  GET_MORE_MAILOUTS_PENDING,
  setCanFetchMore,
  getMoreMailoutsSuccess,
  getMoreMailoutsError,
  resetMailouts,
} from './actions';
import ApiService from '../../../services/api/index';
import { SELECT_PEER_ID, DESELECT_PEER_ID } from '../peer/actions';
import { call, put, select, takeEvery } from '@redux-saga/core/effects';

export const getSelectedPeerId = state => state.peer.peerId;
export const getMailoutsPage = state => state.mailouts.page;
const limit = 25;

export function* getMailoutSaga({ peerId = null }) {
  try {
    const { path, method } = peerId ? ApiService.directory.peer.mailout.list(peerId) : ApiService.directory.user.mailout.list();
    const page = yield select(getMailoutsPage);
    const response = yield call(ApiService[method], path, { page, limit });

    if (response.length === 0 || response.length < limit) {
      yield put(setCanFetchMore(false));
    } else {
      yield put(setCanFetchMore(true));
    }

    yield put(getMailoutsSuccess(response));
  } catch (err) {
    yield put(getMailoutsError(err.message));
  }
}

export function* getMoreMailoutSaga({ peerId = null }) {
  try {
    const { path, method } = peerId ? ApiService.directory.peer.mailout.list(peerId) : ApiService.directory.user.mailout.list();
    const page = yield select(getMailoutsPage);
    const response = yield call(ApiService[method], path, { page, limit });

    if (response.length === 0 || response.length < limit) {
      yield put(setCanFetchMore(false));
    } else {
      yield put(setCanFetchMore(true));
    }

    yield put(getMoreMailoutsSuccess(response));
  } catch (err) {
    yield put(getMoreMailoutsError(err.message));
  }
}

export function* checkIfPeerSelectedGetMailout() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getMailoutSaga({ peerId });
  } else {
    yield getMailoutSaga({});
  }
}

export function* checkIfPeerSelectedResetAndGetMailout() {
  const peerId = yield select(getSelectedPeerId);

  yield put(resetMailouts());

  if (peerId) {
    yield getMailoutSaga({ peerId });
  } else {
    yield getMailoutSaga({});
  }
}

export function* checkIfPeerSelectedGetMoreMailout() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getMoreMailoutSaga({ peerId });
  } else {
    yield getMoreMailoutSaga({});
  }
}

export default function*() {
  yield takeEvery(GET_MAILOUTS_PENDING, checkIfPeerSelectedGetMailout);
  yield takeEvery(GET_MORE_MAILOUTS_PENDING, checkIfPeerSelectedGetMoreMailout);
  yield takeEvery(SELECT_PEER_ID, checkIfPeerSelectedResetAndGetMailout);
  yield takeEvery(DESELECT_PEER_ID, checkIfPeerSelectedResetAndGetMailout);
}
