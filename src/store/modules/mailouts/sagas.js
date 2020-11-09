import {
  GET_MAILOUTS_PENDING,
  getMailoutsSuccess,
  getMailoutsError,
  GET_MORE_MAILOUTS_PENDING,
  setCanFetchMore,
  getMoreMailoutsSuccess,
  getMoreMailoutsError,
  resetMailouts,
  getArchivedMailoutsSuccess,
  getArchivedMailoutsError,
  GET_ARCHIVED_MAILOUTS_PENDING,
  GET_MORE_ARCHIVED_MAILOUTS_PENDING,
  getMoreArchivedMailoutsSuccess,
  getMoreArchivedMailoutsError,
  getMailoutsPending,
  getArchivedMailoutsPending,
  ADD_CAMPAIGN_START,
  addCampaignError,
  addCampaignSuccess,
} from './actions';
import ApiService from '../../../services/api/index';
import { SELECT_PEER_ID, DESELECT_PEER_ID } from '../peer/actions';
import { call, put, select, takeLatest } from '@redux-saga/core/effects';

export const getSelectedPeerId = state => state.peer.peerId;
export const getMailoutsPage = state => state.mailouts.page;
export const getArchivedMailoutsPage = state => state.mailouts.archivedPage;
export const getAddCampaignMlsNum = state => state.mailouts.addCampaignMlsNum;

const limit = 25;
const hideArchived = { hideExcluded: true, hideArchived: true };

export function* getMailoutSaga({ peerId = null }) {
  try {
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.list(peerId)
      : ApiService.directory.user.mailout.list();
    const response = yield call(ApiService[method], path, { page: 1, limit, ...hideArchived });

    if (response.length === 0 || response.length < limit) {
      yield put(setCanFetchMore(false));
    } else {
      yield put(setCanFetchMore(true));
    }

    yield put(getMailoutsSuccess(response));
  } catch (err) {
    yield put(getMailoutsError(err));
  }
}

export function* getMoreMailoutSaga({ peerId = null }) {
  try {
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.list(peerId)
      : ApiService.directory.user.mailout.list();
    const page = yield select(getMailoutsPage);
    const response = yield call(ApiService[method], path, { page, limit, ...hideArchived });

    if (response.length === 0 || response.length < limit) {
      yield put(setCanFetchMore(false));
    } else {
      yield put(setCanFetchMore(true));
    }

    yield put(getMoreMailoutsSuccess(response));
  } catch (err) {
    yield put(getMoreMailoutsError(err));
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

export function* resetAndGetMailoutSaga() {
  yield put(resetMailouts());

  const location = yield document.location.pathname;

  if (location.includes('/dashboard/archived')) {
    yield put(getArchivedMailoutsPending());
  } else if (location.includes('/dashboard')) {
    yield put(getMailoutsPending());
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

export function* getArchivedMailoutSaga({ peerId = null }) {
  try {
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.ignored(peerId)
      : ApiService.directory.user.mailout.ignored();
    const response = yield call(ApiService[method], path, { page: 1, limit });

    if (response.length === 0 || response.length < limit) {
      yield put(setCanFetchMore(false));
    } else {
      yield put(setCanFetchMore(true));
    }

    yield put(getArchivedMailoutsSuccess(response));
  } catch (err) {
    yield put(getArchivedMailoutsError(err));
  }
}

export function* getMoreArchivedMailoutSaga({ peerId = null }) {
  try {
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.ignored(peerId)
      : ApiService.directory.user.mailout.ignored();
    const page = yield select(getArchivedMailoutsPage);
    const response = yield call(ApiService[method], path, { page, limit });

    if (response.length === 0 || response.length < limit) {
      yield put(setCanFetchMore(false));
    } else {
      yield put(setCanFetchMore(true));
    }

    yield put(getMoreArchivedMailoutsSuccess(response));
  } catch (err) {
    yield put(getMoreArchivedMailoutsError(err));
  }
}

export function* checkIfPeerSelectedGetArchivedMailout() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getArchivedMailoutSaga({ peerId });
  } else {
    yield getArchivedMailoutSaga({});
  }
}

export function* checkIfPeerSelectedGetMoreArchivedMailout() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getMoreArchivedMailoutSaga({ peerId });
  } else {
    yield getMoreArchivedMailoutSaga({});
  }
}

export function* addCampaignStartSaga() {
  const peerId = yield select(getSelectedPeerId);
  const payload = yield select(getAddCampaignMlsNum);
  const mlsNum = payload.mlsNum;
  const postcardSize = payload.postcardSize;
  try {
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.byMls(mlsNum, peerId)
      : ApiService.directory.user.mailout.byMls(mlsNum);

    const data = { mlsNum, postcardSize, skipEmailNotification: true };
    const response = yield call(ApiService[method], path, data);

    yield put(resetMailouts());
    yield put(addCampaignSuccess(response));
    yield put(getMailoutsPending());
  } catch (err) {
    yield put(addCampaignError(err));
  }
}

export default function*() {
  yield takeLatest(GET_MAILOUTS_PENDING, checkIfPeerSelectedGetMailout);
  yield takeLatest(GET_MORE_MAILOUTS_PENDING, checkIfPeerSelectedGetMoreMailout);
  yield takeLatest(GET_ARCHIVED_MAILOUTS_PENDING, checkIfPeerSelectedGetArchivedMailout);
  yield takeLatest(GET_MORE_ARCHIVED_MAILOUTS_PENDING, checkIfPeerSelectedGetMoreArchivedMailout);
  yield takeLatest(SELECT_PEER_ID, resetAndGetMailoutSaga);
  yield takeLatest(DESELECT_PEER_ID, resetAndGetMailoutSaga);
  yield takeLatest(ADD_CAMPAIGN_START, addCampaignStartSaga);
}
