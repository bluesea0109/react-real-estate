import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  GET_TEAM_SOLD_SHORTCODE_PENDING,
  getTeamSoldShortcodeSuccess,
  getTeamSoldShortcodeError,
  SAVE_TEAM_SOLD_SHORTCODE_PENDING,
  SAVE_TEAM_SOLD_SHORTCODE_SUCCESS,
  saveTeamSoldShortcodeSuccess,
  saveTeamSoldShortcodeError,
  GET_TEAM_LISTED_SHORTCODE_PENDING,
  getTeamListedShortcodeSuccess,
  getTeamListedShortcodeError,
  SAVE_TEAM_LISTED_SHORTCODE_PENDING,
  SAVE_TEAM_LISTED_SHORTCODE_SUCCESS,
  saveTeamListedShortcodeSuccess,
  saveTeamListedShortcodeError,
} from './actions';

import ApiService from '../../../services/api/index';

export const teamShortcodeSoldToSave = state => state.teamShortcode.soldToSave;
export const teamShortcodeListedToSave = state => state.teamShortcode.listedToSave;

export function* getTeamSoldShortcodeSaga() {
  try {
    const { path, method } = ApiService.directory.onboard.teamCustomization.shortcode.sold.get();
    const response = yield call(ApiService[method], path);

    yield put(getTeamSoldShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(getTeamSoldShortcodeError(err.message));
  }
}

export function* saveTeamSoldShortcodeSaga() {
  try {
    const soldShortcode = yield select(teamShortcodeSoldToSave);

    const { path, method } = ApiService.directory.onboard.teamCustomization.shortcode.sold.save();
    const response = yield call(ApiService[method], path, { cta: soldShortcode });

    yield put(saveTeamSoldShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(saveTeamSoldShortcodeError(err.message));
  }
}

export function* getTeamListedShortcodeSaga() {
  try {
    const { path, method } = ApiService.directory.onboard.teamCustomization.shortcode.listed.get();
    const response = yield call(ApiService[method], path);

    yield put(getTeamListedShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(getTeamListedShortcodeError(err.message));
  }
}

export function* saveTeamListedShortcodeSaga() {
  try {
    const listedShortcode = yield select(teamShortcodeListedToSave);

    const { path, method } = ApiService.directory.onboard.teamCustomization.shortcode.listed.save();
    const response = yield call(ApiService[method], path, { cta: listedShortcode });

    yield put(saveTeamListedShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(saveTeamListedShortcodeError(err.message));
  }
}

export default function*() {
  yield takeLatest(GET_TEAM_SOLD_SHORTCODE_PENDING, getTeamSoldShortcodeSaga);
  yield takeLatest(SAVE_TEAM_SOLD_SHORTCODE_PENDING, saveTeamSoldShortcodeSaga);
  yield takeLatest(SAVE_TEAM_SOLD_SHORTCODE_SUCCESS, getTeamSoldShortcodeSaga);
  yield takeLatest(GET_TEAM_LISTED_SHORTCODE_PENDING, getTeamListedShortcodeSaga);
  yield takeLatest(SAVE_TEAM_LISTED_SHORTCODE_PENDING, saveTeamListedShortcodeSaga);
  yield takeLatest(SAVE_TEAM_LISTED_SHORTCODE_SUCCESS, getTeamListedShortcodeSaga);
}
