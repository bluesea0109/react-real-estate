import { call, put, select, takeEvery } from '@redux-saga/core/effects';

import {
  GET_MAILOUT_PENDING,
  getMailoutSuccess,
  getMailoutError,
  SUBMIT_MAILOUT_PENDING,
  submitMailoutSuccess,
  submitMailoutError,
  STOP_MAILOUT_PENDING,
  stopMailoutSuccess,
  stopMailoutError,
  UPDATE_MAILOUT_SIZE_PENDING,
  updateMailoutSizeSuccess,
  updateMailoutSizeError,
} from './actions';
import ApiService from '../../../services/api/index';

export const getSelectedPeerId = state => state.peer.peerId;
export const getMailoutId = state => state.mailout.mailoutId;
export const getMailoutSize = state => state.mailout.mailoutSize;

export function* getMailoutSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId ? ApiService.directory.peer.mailout.get(mailoutId, peerId) : ApiService.directory.user.mailout.get(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(getMailoutSuccess(response));
  } catch (err) {
    yield put(getMailoutError(err.message));
  }
}

export function* submitMailoutSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId ? ApiService.directory.peer.mailout.submit(mailoutId, peerId) : ApiService.directory.user.mailout.submit(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(submitMailoutSuccess(response));
  } catch (err) {
    yield put(submitMailoutError(err.message));
  }
}

export function* stopMailoutSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId ? ApiService.directory.peer.mailout.stop(mailoutId, peerId) : ApiService.directory.user.mailout.stop(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(stopMailoutSuccess(response));
  } catch (err) {
    yield put(stopMailoutError(err.message));
  }
}

export function* updatetMailoutSizeSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const mailoutSize = yield select(getMailoutSize);
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.mailoutSize(mailoutId, peerId)
      : ApiService.directory.user.mailout.mailoutSize(mailoutId);

    const data = { mailoutSize: parseInt(mailoutSize, 10) };
    const response = yield call(ApiService[method], path, data);

    console.log('updatetMailoutSizeSaga', response);

    yield put(updateMailoutSizeSuccess(response));
  } catch (err) {
    yield put(updateMailoutSizeError(err.message));
  }
}

export function* checkIfPeerSelectedGetMailoutSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getMailoutSaga({ peerId });
  } else {
    yield getMailoutSaga({});
  }
}

export function* checkIfPeerSelectedSubmitMailoutSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield submitMailoutSaga({ peerId });
  } else {
    yield submitMailoutSaga({});
  }
}

export function* checkIfPeerSelectedStopMailoutSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield stopMailoutSaga({ peerId });
  } else {
    yield stopMailoutSaga({});
  }
}

export function* checkIfPeerSelectedUpdatetMailoutSizeSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield updatetMailoutSizeSaga({ peerId });
  } else {
    yield updatetMailoutSizeSaga({});
  }
}

export default function*() {
  yield takeEvery(GET_MAILOUT_PENDING, checkIfPeerSelectedGetMailoutSaga);
  yield takeEvery(SUBMIT_MAILOUT_PENDING, checkIfPeerSelectedSubmitMailoutSaga);
  yield takeEvery(STOP_MAILOUT_PENDING, checkIfPeerSelectedStopMailoutSaga);
  yield takeEvery(UPDATE_MAILOUT_SIZE_PENDING, checkIfPeerSelectedUpdatetMailoutSizeSaga);
}
