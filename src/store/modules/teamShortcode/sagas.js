import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  SAVE_TEAM_SOLD_SHORTCODE_PENDING,
  saveTeamSoldShortcodeSuccess,
  saveTeamSoldShortcodeError,
  SAVE_TEAM_LISTED_SHORTCODE_PENDING,
  saveTeamListedShortcodeSuccess,
  saveTeamListedShortcodeError,
} from './actions';

import ApiService from '../../../services/api/index';

export const teamShortcodeSoldToSave = state => state.teamShortcode.soldURLToShorten;
export const teamShortcodeListedToSave = state => state.teamShortcode.listedURLToShorten;

export function* saveTeamSoldShortcodeSaga() {
  try {
    const soldShortcode = yield select(teamShortcodeSoldToSave);

    const { path, method } = ApiService.directory.onboard.teamCustomization.shortcode.sold.save();
    const response = yield call(ApiService[method], path, { cta: soldShortcode });

    yield put(saveTeamSoldShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(saveTeamSoldShortcodeError(err));
  }
}

export function* saveTeamListedShortcodeSaga() {
  try {
    const listedShortcode = yield select(teamShortcodeListedToSave);

    const { path, method } = ApiService.directory.onboard.teamCustomization.shortcode.listed.save();
    const response = yield call(ApiService[method], path, { cta: listedShortcode });

    yield put(saveTeamListedShortcodeSuccess(response.shortUrl));
  } catch (err) {
    yield put(saveTeamListedShortcodeError(err));
  }
}

export default function*() {
  yield takeLatest(SAVE_TEAM_SOLD_SHORTCODE_PENDING, saveTeamSoldShortcodeSaga);
  yield takeLatest(SAVE_TEAM_LISTED_SHORTCODE_PENDING, saveTeamListedShortcodeSaga);
}
