import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  SAVE_SOLD_SHORTCODE_PENDING,
  saveSoldShortcodeSuccess,
  saveSoldShortcodeError,
  SAVE_LISTED_SHORTCODE_PENDING,
  saveListedShortcodeSuccess,
  saveListedShortcodeError,
} from './actions';

import ApiService from '../../../services/api/index';

export const getSelectedPeerId = state => state.peer.peerId;
export const shortcodeSoldToSave = state => state.shortcode.soldURLToShorten;
export const shortcodeListedToSave = state => state.shortcode.listedURLToShorten;

export function* saveSoldShortcodeSaga({ peerId = null }) {
  try {
    const soldShortcode = yield select(shortcodeSoldToSave);

    const { path, method } = peerId ? ApiService.directory.peer.shortcode.sold.save(peerId) : ApiService.directory.user.shortcode.sold.save();
    const response = yield call(ApiService[method], path, { cta: soldShortcode });

    yield put(saveSoldShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(saveSoldShortcodeError(err));
  }
}

export function* saveListedShortcodeSaga({ peerId = null }) {
  try {
    const listedShortcode = yield select(shortcodeListedToSave);

    const { path, method } = peerId ? ApiService.directory.peer.shortcode.listed.save(peerId) : ApiService.directory.user.shortcode.listed.save();
    const response = yield call(ApiService[method], path, { cta: listedShortcode });

    yield put(saveListedShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(saveListedShortcodeError(err));
  }
}

export function* checkIfPeerSelectedSaveSoldShortcodeSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield saveSoldShortcodeSaga({ peerId });
  } else {
    yield saveSoldShortcodeSaga({});
  }
}

export function* checkIfPeerSelectedSaveListedShortcodeSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield saveListedShortcodeSaga({ peerId });
  } else {
    yield saveListedShortcodeSaga({});
  }
}

export default function*() {
  yield takeLatest(SAVE_SOLD_SHORTCODE_PENDING, checkIfPeerSelectedSaveSoldShortcodeSaga);
  yield takeLatest(SAVE_LISTED_SHORTCODE_PENDING, checkIfPeerSelectedSaveListedShortcodeSaga);
}
