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

import ApiService from '../../../services/api/index';

export const shortcodeSoldToSave = state => state.shortcode.soldToSave;
export const shortcodeListedToSave = state => state.shortcode.listedToSave;

export function* getSoldShortcodeSaga() {
  try {
    const { path, method } = ApiService.directory.onboard.customization.shortcode.sold.get();
    const response = yield call(ApiService[method], path);

    yield put(getSoldShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(getSoldShortcodeError(err.message));
  }
}

export function* saveSoldShortcodeSaga() {
  try {
    const soldShortcode = yield select(shortcodeSoldToSave);

    const { path, method } = ApiService.directory.onboard.customization.shortcode.sold.save();
    const response = yield call(ApiService[method], path, { cta: soldShortcode });

    yield put(saveSoldShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(saveSoldShortcodeError(err.message));
  }
}

export function* getListedShortcodeSaga() {
  try {
    const { path, method } = ApiService.directory.onboard.customization.shortcode.listed.get();
    const response = yield call(ApiService[method], path);

    yield put(getListedShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(getListedShortcodeError(err.message));
  }
}

export function* saveListedShortcodeSaga() {
  try {
    const listedShortcode = yield select(shortcodeListedToSave);

    const { path, method } = ApiService.directory.onboard.customization.shortcode.listed.save();
    const response = yield call(ApiService[method], path, { cta: listedShortcode });

    yield put(saveListedShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(saveListedShortcodeError(err.message));
  }
}

export default function*() {
  yield takeLatest(GET_SOLD_SHORTCODE_PENDING, getSoldShortcodeSaga);
  yield takeLatest(SAVE_SOLD_SHORTCODE_PENDING, saveSoldShortcodeSaga);
  yield takeLatest(SAVE_SOLD_SHORTCODE_SUCCESS, getSoldShortcodeSaga);
  yield takeLatest(GET_LISTED_SHORTCODE_PENDING, getListedShortcodeSaga);
  yield takeLatest(SAVE_LISTED_SHORTCODE_PENDING, saveListedShortcodeSaga);
  yield takeLatest(SAVE_LISTED_SHORTCODE_SUCCESS, getListedShortcodeSaga);
}
