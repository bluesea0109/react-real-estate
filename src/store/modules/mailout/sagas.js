import { call, put, select, takeLatest } from '@redux-saga/core/effects';

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
  UPDATE_MAILOUT_NAME_PENDING,
  updateMailoutNameSuccess,
  updateMailoutNameError,
  CHANGE_MAILOUT_DISPLAY_AGENT_PENDING,
  changeMailoutDisplayAgentSuccess,
  changeMailoutDisplayAgentError,
  GET_MAILOUT_EDIT_PENDING,
  getMailoutEditSuccess,
  getMailoutEditError,
  UPDATE_MAILOUT_EDIT_PENDING,
  updateMailoutEditSuccess,
  updateMailoutEditError,
  UPDATE_MAILOUT_TEMPLATE_THEME_PENDING,
  updateMailoutTemplateThemeSuccess,
  updateMailoutTemplateThemeError,
  REVERT_MAILOUT_EDIT_PENDING,
  revertMailoutEditSuccess,
  revertMailoutEditError,
  ARCHIVE_MAILOUT_PENDING,
  archiveMailoutSuccess,
  archiveMailoutError,
  DUPLICATE_MAILOUT_PENDING,
  UNDO_ARCHIVE_MAILOUT_PENDING,
  duplicateMailoutSuccess,
  duplicateMailoutError,
  undoArchiveMailoutSuccess,
  undoArchiveMailoutError,
  updateMailoutEditValues,
} from './actions';
import ApiService from '../../../services/api/index';
import { getMailoutsPending } from '../mailouts/actions';
import { setReloadIframes, setReloadIframesPending } from '../liveEditor/actions';

export const getSelectedPeerId = state => state.peer.peerId;
export const getMailoutId = state => state.mailout.mailoutId;
export const getMailoutSize = state => state.mailout.mailoutSize;
export const getMailoutName = state => state.mailout.details.name;
export const getMailoutEdit = state => state.mailout.mailoutEdit;
export const getMailoutDisplayAgent = state => state.mailout.mailoutDisplayAgent;
export const getReloadIframesPending = state => state.liveEditor.reloadIframesPending;

export function* getMailoutSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.get(mailoutId, peerId)
      : ApiService.directory.user.mailout.get(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(getMailoutSuccess(response));
  } catch (err) {
    yield put(getMailoutError(err));
  }
}

export function* getDuplicateSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.clone(mailoutId, peerId)
      : ApiService.directory.user.mailout.clone(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(duplicateMailoutSuccess(response));
    yield put(getMailoutsPending());
  } catch (err) {
    yield put(duplicateMailoutError(err));
  }
}

export function* submitMailoutSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.submit(mailoutId, peerId)
      : ApiService.directory.user.mailout.submit(mailoutId);
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
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.stop(mailoutId, peerId)
      : ApiService.directory.user.mailout.stop(mailoutId);
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

export function* updateMailoutNameSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const mailoutName = yield select(getMailoutName);
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.mailoutName(mailoutId, peerId)
      : ApiService.directory.user.mailout.mailoutName(mailoutId);

    const data = { name: mailoutName };
    const response = yield call(ApiService[method], path, data);

    yield put(updateMailoutNameSuccess(response));
  } catch (err) {
    yield put(updateMailoutNameError(err));
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

export function* getMailoutEditSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.edit.get(mailoutId, peerId)
      : ApiService.directory.user.mailout.edit.get(mailoutId);

    const response = yield call(ApiService[method], path);

    yield put(getMailoutEditSuccess(response));
  } catch (err) {
    yield put(getMailoutEditError(err));
  }
}

export function* updateMailoutEditSaga({ peerId = null }, action) {
  try {
    const mailoutId = yield select(getMailoutId);
    const mailoutEdit = yield select(getMailoutEdit);
    const newData = action.payload;
    let apiData = {
      postcardSize: mailoutEdit.postcardSize,
      templateTheme: mailoutEdit.templateTheme,
      fields: mailoutEdit.fields,
      ctas: mailoutEdit.ctas,
      mailoutDisplayAgent: mailoutEdit.mailoutDisplayAgent,
      frontImgUrl: mailoutEdit.frontImgUrl,
      brandColor: mailoutEdit.brandColor,
      name: mailoutEdit.name,
    };
    apiData = { ...apiData, ...newData };
    const reloadIframesPending = yield select(getReloadIframesPending);
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.edit.update(mailoutId, peerId)
      : ApiService.directory.user.mailout.edit.update(mailoutId);
    const response = yield call(ApiService[method], path, apiData);
    yield put(updateMailoutEditValues(apiData));
    if (reloadIframesPending) {
      yield put(setReloadIframes(true));
    }
    yield put(updateMailoutEditSuccess(response));
  } catch (err) {
    yield put(updateMailoutEditError(err));
    yield put(setReloadIframesPending(false));
  }
}

export function* updateMailoutTemplateThemeSaga() {
  try {
    const mailoutId = yield select(getMailoutId);
    const mailoutEdit = yield select(getMailoutEdit);
    const { path, method } = ApiService.directory.user.mailout.getStencilFields(
      mailoutId,
      mailoutEdit.templateTheme
    );

    const response = yield call(ApiService[method], path);

    yield put(updateMailoutTemplateThemeSuccess(response));
  } catch (err) {
    yield put(updateMailoutTemplateThemeError(err));
  }
}

export function* revertMailoutEditSaga({ peerId = null }) {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.edit.revert(mailoutId, peerId)
      : ApiService.directory.user.mailout.edit.revert(mailoutId);

    const response = yield call(ApiService[method], path);

    yield put(revertMailoutEditSuccess(response));
  } catch (err) {
    yield put(revertMailoutEditError(err));
  }
}

export function* archiveMailoutSaga({ peerId = null }, action) {
  try {
    const mailoutId = yield action.payload;
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.archive(mailoutId, peerId)
      : ApiService.directory.user.mailout.archive(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(archiveMailoutSuccess(response));
  } catch (err) {
    yield put(archiveMailoutError(err));
  }
}

export function* undoArchiveMailoutSaga({ peerId = null }, action) {
  try {
    const mailoutId = yield action.payload;
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.unarchive(mailoutId, peerId)
      : ApiService.directory.user.mailout.unarchive(mailoutId);
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

export function* checkIfPeerSelectedDuplicateSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getDuplicateSaga({ peerId });
  } else {
    yield getDuplicateSaga({});
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

export function* checkIfPeerSelectedUpdatetMailoutNameSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield updateMailoutNameSaga({ peerId });
  } else {
    yield updateMailoutNameSaga({});
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

export function* checkIfPeerSelectedGetMailoutEditSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getMailoutEditSaga({ peerId });
  } else {
    yield getMailoutEditSaga({});
  }
}

export function* checkIfPeerSelectedUpdateMailoutEditSaga(action) {
  const peerId = yield select(getSelectedPeerId);
  if (peerId) {
    yield updateMailoutEditSaga({ peerId }, action);
  } else {
    yield updateMailoutEditSaga({}, action);
  }
}

export function* checkIfPeerSelectedUpdateMailoutTemplateThemeSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield updateMailoutTemplateThemeSaga({ peerId });
  } else {
    yield updateMailoutTemplateThemeSaga({});
  }
}

export function* checkIfPeerSelectedRevertMailoutEditSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield revertMailoutEditSaga({ peerId });
  } else {
    yield revertMailoutEditSaga({});
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
  yield takeLatest(SUBMIT_MAILOUT_PENDING, checkIfPeerSelectedSubmitMailoutSaga);
  yield takeLatest(STOP_MAILOUT_PENDING, checkIfPeerSelectedStopMailoutSaga);
  yield takeLatest(UPDATE_MAILOUT_SIZE_PENDING, checkIfPeerSelectedUpdatetMailoutSizeSaga);
  yield takeLatest(UPDATE_MAILOUT_NAME_PENDING, checkIfPeerSelectedUpdatetMailoutNameSaga);
  yield takeLatest(
    CHANGE_MAILOUT_DISPLAY_AGENT_PENDING,
    checkIfPeerSelectedChangeMailoutDisplayAgentSaga
  );
  yield takeLatest(GET_MAILOUT_EDIT_PENDING, checkIfPeerSelectedGetMailoutEditSaga);
  yield takeLatest(UPDATE_MAILOUT_EDIT_PENDING, checkIfPeerSelectedUpdateMailoutEditSaga);
  yield takeLatest(
    UPDATE_MAILOUT_TEMPLATE_THEME_PENDING,
    checkIfPeerSelectedUpdateMailoutTemplateThemeSaga
  );
  yield takeLatest(REVERT_MAILOUT_EDIT_PENDING, checkIfPeerSelectedRevertMailoutEditSaga);
  yield takeLatest(ARCHIVE_MAILOUT_PENDING, checkIfPeerSelectedArchiveMailoutSaga);
  yield takeLatest(DUPLICATE_MAILOUT_PENDING, checkIfPeerSelectedDuplicateSaga);
  yield takeLatest(UNDO_ARCHIVE_MAILOUT_PENDING, checkIfPeerSelectedUndoArchiveMailoutSaga);
}
