import { call, put, select, takeEvery } from '@redux-saga/core/effects';

import {
  GET_MAILOUT_PENDING,
  getMailoutSuccess,
  getMailoutError,
  MODIFY_MAILOUT_PENDING,
  modifyMailoutSuccess,
  modifyMailoutError,
  SUBMIT_MAILOUT_PENDING,
  submitMailoutSuccess,
  submitMailoutError,
  STOP_MAILOUT_PENDING,
  stopMailoutSuccess,
  stopMailoutError,
  UPDATE_MAILOUT_SIZE_PENDING,
  updateMailoutSizeSuccess,
  updateMailoutSizeError,
  checkIfMailoutNeedsUpdatePending,
  checkIfMailoutNeedsUpdateSuccess,
  checkIfMailoutNeedsUpdateError,
  updateMailoutPending,
  updateMailoutSuccess,
  updateMailoutError,
} from './actions';
import ApiService from '../../../services/api/index';

export const getSelectedPeerId = state => state.peer.peerId;
export const getMailoutId = state => state.mailout.mailoutId;
export const getMailoutSize = state => state.mailout.mailoutSize;
export const getMailoutEdit = state => state.mailout.mailoutEdit;

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

export function* modifyMailoutSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const mailoutEdit = yield select(getMailoutEdit);
    const { path, method } = peerId ? ApiService.directory.peer.mailout.edit(mailoutId, peerId) : ApiService.directory.user.mailout.edit(mailoutId);

    const response = yield call(ApiService[method], path, mailoutEdit);

    yield put(modifyMailoutSuccess(response));
  } catch (err) {
    yield put(modifyMailoutError(err.message));
  }
}

export function* submitMailoutSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId ? ApiService.directory.peer.mailout.submit(mailoutId, peerId) : ApiService.directory.user.mailout.submit(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(submitMailoutSuccess(response));

    if (peerId) {
      yield getMailoutSaga({ peerId });
    } else {
      yield getMailoutSaga({});
    }
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

    if (peerId) {
      yield getMailoutSaga({ peerId });
    } else {
      yield getMailoutSaga({});
    }
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

    yield put(updateMailoutSizeSuccess(response));

    if (peerId) {
      yield getMailoutSaga({ peerId });
    } else {
      yield getMailoutSaga({});
    }
  } catch (err) {
    yield put(updateMailoutSizeError(err.message));
  }
}

export function* UpdateMailoutSaga({ peerId = null }) {
  try {
    yield put(updateMailoutPending());

    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId ? ApiService.directory.peer.mailout.update(mailoutId, peerId) : ApiService.directory.user.mailout.update(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(updateMailoutSuccess(response));

    if (peerId) {
      yield getMailoutSaga({ peerId });
    } else {
      yield getMailoutSaga({});
    }
  } catch (err) {
    yield put(updateMailoutError(err.message));
  }
}

export function* checkIfMailoutNeedsUpdateSaga({ peerId = null }) {
  try {
    yield put(checkIfMailoutNeedsUpdatePending());

    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.needsUpdate(mailoutId, peerId)
      : ApiService.directory.user.mailout.needsUpdate(mailoutId);
    const response = yield call(ApiService[method], path);
    const { changed } = response;

    yield put(checkIfMailoutNeedsUpdateSuccess(response));

    if (changed) {
      if (peerId) {
        yield UpdateMailoutSaga({ peerId });
      } else {
        yield UpdateMailoutSaga({});
      }
    }
  } catch (err) {
    yield put(checkIfMailoutNeedsUpdateError(err.message));
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

export function* checkIfPeerSelectedModifyMailoutSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield modifyMailoutSaga({ peerId });
  } else {
    yield modifyMailoutSaga({});
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

export function* checkIfPeerSelectedNeedsUpdateSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield checkIfMailoutNeedsUpdateSaga({ peerId });
  } else {
    yield checkIfMailoutNeedsUpdateSaga({});
  }
}

export default function*() {
  yield takeEvery(GET_MAILOUT_PENDING, checkIfPeerSelectedGetMailoutSaga);
  yield takeEvery(GET_MAILOUT_PENDING, checkIfPeerSelectedNeedsUpdateSaga);
  yield takeEvery(MODIFY_MAILOUT_PENDING, checkIfPeerSelectedModifyMailoutSaga);
  yield takeEvery(SUBMIT_MAILOUT_PENDING, checkIfPeerSelectedSubmitMailoutSaga);
  yield takeEvery(STOP_MAILOUT_PENDING, checkIfPeerSelectedStopMailoutSaga);
  yield takeEvery(UPDATE_MAILOUT_SIZE_PENDING, checkIfPeerSelectedUpdatetMailoutSizeSaga);
}
