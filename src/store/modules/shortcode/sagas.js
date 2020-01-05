import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  GET_SOLD_SHORTCODE_PENDING,
  getSoldShortcodeSuccess,
  getSoldShortcodeError,
  SAVE_SOLD_SHORTCODE_PENDING,
  SAVE_SOLD_SHORTCODE_SUCCESS,
  saveSoldShortcodeSuccess,
  saveSoldShortcodeError,
  GET_LISTED_SHORTCODE_PENDING,
  getListedShortcodeSuccess,
  getListedShortcodeError,
  SAVE_LISTED_SHORTCODE_PENDING,
  SAVE_LISTED_SHORTCODE_SUCCESS,
  saveListedShortcodeSuccess,
  saveListedShortcodeError,
} from './actions';
import { GET_CUSTOMIZATION_SUCCESS } from '../customization/actions';

import ApiService from '../../../services/api/index';

export const getSelectedPeerId = state => state.peer.peerId;
export const shortcodeSoldToSave = state => state.shortcode.soldToSave;
export const shortcodeListedToSave = state => state.shortcode.listedToSave;

export function* getSoldShortcodeSaga({ peerId = null }) {
  try {
    const { path, method } = peerId ? ApiService.directory.peer.shortcode.sold.get(peerId) : ApiService.directory.user.shortcode.sold.get();
    const response = yield call(ApiService[method], path);

    yield put(getSoldShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(getSoldShortcodeError(err.message));
  }
}

export function* saveSoldShortcodeSaga({ peerId = null }) {
  try {
    const soldShortcode = yield select(shortcodeSoldToSave);

    const { path, method } = peerId ? ApiService.directory.peer.shortcode.sold.save(peerId) : ApiService.directory.user.shortcode.sold.save();
    const response = yield call(ApiService[method], path, { cta: soldShortcode });

    yield put(saveSoldShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(saveSoldShortcodeError(err.message));
  }
}

export function* getListedShortcodeSaga({ peerId = null }) {
  try {
    const { path, method } = peerId ? ApiService.directory.peer.shortcode.listed.get(peerId) : ApiService.directory.user.shortcode.listed.get();
    const response = yield call(ApiService[method], path);

    yield put(getListedShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(getListedShortcodeError(err.message));
  }
}

export function* saveListedShortcodeSaga({ peerId = null }) {
  try {
    const listedShortcode = yield select(shortcodeListedToSave);

    const { path, method } = peerId ? ApiService.directory.peer.shortcode.listed.save(peerId) : ApiService.directory.user.shortcode.listed.save();
    const response = yield call(ApiService[method], path, { cta: listedShortcode });

    yield put(saveListedShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(saveListedShortcodeError(err.message));
  }
}

export function* checkIfPeerSelectedGetSoldShortcodeSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getSoldShortcodeSaga({ peerId });
  } else {
    yield getSoldShortcodeSaga({});
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

export function* checkIfPeerSelectedGetListedShortcodeSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getListedShortcodeSaga({ peerId });
  } else {
    yield getListedShortcodeSaga({});
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
  yield takeLatest(GET_SOLD_SHORTCODE_PENDING, checkIfPeerSelectedGetSoldShortcodeSaga);
  yield takeLatest(SAVE_SOLD_SHORTCODE_PENDING, checkIfPeerSelectedSaveSoldShortcodeSaga);
  yield takeLatest(SAVE_SOLD_SHORTCODE_SUCCESS, checkIfPeerSelectedGetSoldShortcodeSaga);
  yield takeLatest(GET_LISTED_SHORTCODE_PENDING, checkIfPeerSelectedGetListedShortcodeSaga);
  yield takeLatest(SAVE_LISTED_SHORTCODE_PENDING, checkIfPeerSelectedSaveListedShortcodeSaga);
  yield takeLatest(SAVE_LISTED_SHORTCODE_SUCCESS, checkIfPeerSelectedGetListedShortcodeSaga);
  yield takeLatest(GET_CUSTOMIZATION_SUCCESS, checkIfPeerSelectedGetSoldShortcodeSaga);
  yield takeLatest(GET_CUSTOMIZATION_SUCCESS, checkIfPeerSelectedGetListedShortcodeSaga);
}
