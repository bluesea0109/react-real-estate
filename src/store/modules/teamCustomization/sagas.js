import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  GET_TEAM_CUSTOMIZATION_PENDING,
  getTeamCustomizationSuccess,
  getTeamCustomizationError,
  SAVE_TEAM_CUSTOMIZATION_PENDING,
  saveTeamCustomizationSuccess,
  saveTeamCustomizationError,
} from './actions';
import ApiService from '../../../services/api/index';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';

export const teamCustomizationToSave = state => state.teamCustomization.toSave;

export function* getTeamCustomizationSaga() {
  try {
    const { path, method } = ApiService.directory.team.customization.get();
    const response = yield call(ApiService[method], path);

    yield put(getTeamCustomizationSuccess(response));
  } catch (err) {
    yield put(getTeamCustomizationError(err));
  }
}

export function* saveTeamCustomizationSaga() {
  try {
    const teamCustomization = yield select(teamCustomizationToSave);

    const { path, method } = ApiService.directory.team.customization.save();
    const response = yield call(ApiService[method], path, teamCustomization);

    yield put(saveTeamCustomizationSuccess(response));
  } catch (err) {
    yield put(saveTeamCustomizationError(err));
  }
}

export default function*() {
  yield takeLatest(GET_TEAM_CUSTOMIZATION_PENDING, getTeamCustomizationSaga);
  yield takeLatest(SAVE_TEAM_CUSTOMIZATION_PENDING, saveTeamCustomizationSaga);
  yield takeLatest(GET_ON_LOGIN_SUCCESS, getTeamCustomizationSaga);
}
