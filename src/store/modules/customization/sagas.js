import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  getCustomizationPending,
  getCustomizationSuccess,
  getCustomizationError,
  SAVE_CUSTOMIZATION_PENDING,
  saveCustomizationSuccess,
  saveCustomizationError,
} from './actions';
import { setCompletedCustomization, setOnboardedStatus } from '../onboarded/actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';

import ApiService from '../../../services/api/index';

export const getOnLoginMode = state => state.onLogin.mode;
export const getOnboardedStatus = state => state.onboarded.status;
export const customizationToSave = state => state.customization.toSave;
export const checkIfUserIsAdmin = state => state.onLogin && state.onLogin.permissions && state.onLogin.permissions.teamAdmin;

export function* getCustomizationSaga() {
  try {
    yield put(getCustomizationPending());

    const { path, method } = ApiService.directory.onboard.customization.get();
    const response = yield call(ApiService[method], path);

    yield put(getCustomizationSuccess(response));

    const isOnboarded = yield select(getOnboardedStatus);
    const mode = yield select(getOnLoginMode);
    const userIsAdmin = yield select(checkIfUserIsAdmin);
    if (!isOnboarded) yield put(setCompletedCustomization(true));
    if (!isOnboarded && mode !== 'multiuser') yield put(setOnboardedStatus(true));
    if (!isOnboarded && mode === 'multiuser' && !userIsAdmin) yield put(setOnboardedStatus(true));
  } catch (err) {
    yield put(getCustomizationError(err.message));
  }
}

export function* saveCustomizationSaga() {
  try {
    const customization = yield select(customizationToSave);

    const { path, method } = ApiService.directory.onboard.customization.save();
    const response = yield call(ApiService[method], path, customization);

    yield put(saveCustomizationSuccess(response));

    const isOnboarded = yield select(getOnboardedStatus);
    const mode = yield select(getOnLoginMode);
    const userIsAdmin = yield select(checkIfUserIsAdmin);
    if (!isOnboarded) yield put(setCompletedCustomization(true));
    if (!isOnboarded && mode !== 'multiuser') yield put(setOnboardedStatus(true));
    if (!isOnboarded && mode === 'multiuser' && !userIsAdmin) yield put(setOnboardedStatus(true));
  } catch (err) {
    yield put(saveCustomizationError(err.message));
  }
}

export default function*() {
  yield takeLatest(GET_ON_LOGIN_SUCCESS, getCustomizationSaga);
  yield takeLatest(SAVE_CUSTOMIZATION_PENDING, saveCustomizationSaga);
}
