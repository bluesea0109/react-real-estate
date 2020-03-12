import { call, put, select, takeLatest } from '@redux-saga/core/effects';

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
  CHANGE_MAILOUT_DISPLAY_AGENT_PENDING,
  changeMailoutDisplayAgentSuccess,
  changeMailoutDisplayAgentError,
  REVERT_EDITED_MAILOUT_PENDING,
  REVERT_EDITED_MAILOUT_SUCCESS,
  revertEditedMailoutSuccess,
  revertEditedMailoutError,
  ARCHIVE_MAILOUT_PENDING,
  archiveMailoutSuccess,
  archiveMailoutError,
  UNDO_ARCHIVE_MAILOUT_PENDING,
  undoArchiveMailoutSuccess,
  undoArchiveMailoutError,
} from './actions';
import ApiService from '../../../services/api/index';

export const getSelectedPeerId = state => state.peer.peerId;
export const getMailoutId = state => state.mailout.mailoutId;
export const getMailoutSize = state => state.mailout.mailoutSize;
export const getMailoutEdit = state => state.mailout.mailoutEdit;
export const getMailoutDisplayAgent = state => state.mailout.mailoutDisplayAgent;

export function* getMailoutSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId ? ApiService.directory.peer.mailout.get(mailoutId, peerId) : ApiService.directory.user.mailout.get(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(getMailoutSuccess(response));
  } catch (err) {
    yield put(getMailoutError(err));
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
    yield put(modifyMailoutError(err));
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
    yield put(submitMailoutError(err));
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
    yield put(stopMailoutError(err));
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
    yield put(updateMailoutSizeError(err));
  }
}

export function* changeMailoutDisplayAgentSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const mailoutDisplayAgent = yield select(getMailoutDisplayAgent);
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.changeAgent(mailoutId, peerId, mailoutDisplayAgent)
      : ApiService.directory.user.mailout.changeAgent(mailoutId, mailoutDisplayAgent);
    const response = yield call(ApiService[method], path);

    yield put(changeMailoutDisplayAgentSuccess(response));
  } catch (err) {
    yield put(changeMailoutDisplayAgentError(err));
  }
}

export function* revertEditedMailoutSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.revertEdited(mailoutId, peerId)
      : ApiService.directory.user.mailout.revertEdited(mailoutId);

    const response = yield call(ApiService[method], path);

    yield put(revertEditedMailoutSuccess(response));
  } catch (err) {
    yield put(revertEditedMailoutError(err));
  }
}

export function* archiveMailoutSaga({ peerId = null }, action) {
  try {
    const mailoutId = yield action.payload;
    const { path, method } = peerId ? ApiService.directory.peer.mailout.archive(mailoutId, peerId) : ApiService.directory.user.mailout.archive(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(archiveMailoutSuccess(response));
  } catch (err) {
    yield put(archiveMailoutError(err));
  }
}

export function* undoArchiveMailoutSaga({ peerId = null }, action) {
  try {
    const mailoutId = yield action.payload;
    const { path, method } = peerId ? ApiService.directory.peer.mailout.unarchive(mailoutId, peerId) : ApiService.directory.user.mailout.unarchive(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(undoArchiveMailoutSuccess(response));
  } catch (err) {
    yield put(undoArchiveMailoutError(err));
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

export function* checkIfPeerSelectedChangeMailoutDisplayAgentSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield changeMailoutDisplayAgentSaga({ peerId });
  } else {
    yield changeMailoutDisplayAgentSaga({});
  }
}

export function* checkIfPeerSelectedRevertEditedMailoutSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield revertEditedMailoutSaga({ peerId });
  } else {
    yield revertEditedMailoutSaga({});
  }
}

export function* checkIfPeerSelectedArchiveMailoutSaga(action) {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield archiveMailoutSaga({ peerId }, action);
  } else {
    yield archiveMailoutSaga({}, action);
  }
}

export function* checkIfPeerSelectedUndoArchiveMailoutSaga(action) {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield undoArchiveMailoutSaga({ peerId }, action);
  } else {
    yield undoArchiveMailoutSaga({}, action);
  }
}

export default function*() {
  yield takeLatest(GET_MAILOUT_PENDING, checkIfPeerSelectedGetMailoutSaga);
  yield takeLatest(REVERT_EDITED_MAILOUT_SUCCESS, checkIfPeerSelectedGetMailoutSaga);
  yield takeLatest(MODIFY_MAILOUT_PENDING, checkIfPeerSelectedModifyMailoutSaga);
  yield takeLatest(SUBMIT_MAILOUT_PENDING, checkIfPeerSelectedSubmitMailoutSaga);
  yield takeLatest(STOP_MAILOUT_PENDING, checkIfPeerSelectedStopMailoutSaga);
  yield takeLatest(UPDATE_MAILOUT_SIZE_PENDING, checkIfPeerSelectedUpdatetMailoutSizeSaga);
  yield takeLatest(CHANGE_MAILOUT_DISPLAY_AGENT_PENDING, checkIfPeerSelectedChangeMailoutDisplayAgentSaga);
  yield takeLatest(REVERT_EDITED_MAILOUT_PENDING, checkIfPeerSelectedRevertEditedMailoutSaga);
  yield takeLatest(ARCHIVE_MAILOUT_PENDING, checkIfPeerSelectedArchiveMailoutSaga);
  yield takeLatest(UNDO_ARCHIVE_MAILOUT_PENDING, checkIfPeerSelectedUndoArchiveMailoutSaga);
}
