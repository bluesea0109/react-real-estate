import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  getTeamCustomizationPending,
  getTeamCustomizationSuccess,
  getTeamCustomizationError,
  SAVE_TEAM_CUSTOMIZATION_PENDING,
  saveTeamCustomizationSuccess,
  saveTeamCustomizationError,
} from './actions';
import { setCompletedTeamCustomization } from '../onboarded/actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';

import ApiService from '../../../services/api/index';

export const getOnLoginMode = state => state.onLogin.mode;
export const getOnboardedStatus = state => state.onboarded.status;
export const teamCustomizationToSave = state => state.teamCustomization.toSave;

export function* getTeamCustomizationSaga() {
  try {
    yield put(getTeamCustomizationPending());

    const { path, method } = ApiService.directory.onboard.teamCustomization.get();
    const response = yield call(ApiService[method], path);

    yield put(getTeamCustomizationSuccess(response));
    const isOnboarded = yield select(getOnboardedStatus);
    if (!isOnboarded) yield put(setCompletedTeamCustomization(true));
  } catch (err) {
    yield put(getTeamCustomizationError(err.message));
  }
}

export function* saveTeamCustomizationSaga() {
  try {
    const teamCustomization = yield select(teamCustomizationToSave);

    const { path, method } = ApiService.directory.onboard.teamCustomization.save();
    const response = yield call(ApiService[method], path, teamCustomization);

    yield put(saveTeamCustomizationSuccess(response));

    const isOnboarded = yield select(getOnboardedStatus);
    if (!isOnboarded) yield put(setCompletedTeamCustomization(true));
  } catch (err) {
    yield put(saveTeamCustomizationError(err.message));
  }
}

export function* checkIfMultiUser() {
  const mode = yield select(getOnLoginMode);

  if (mode === 'multiuser') {
    yield getTeamCustomizationSaga();
  }
}

export default function*() {
  yield takeLatest(GET_ON_LOGIN_SUCCESS, checkIfMultiUser);
  yield takeLatest(SAVE_TEAM_CUSTOMIZATION_PENDING, saveTeamCustomizationSaga);
}
