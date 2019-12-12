import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  getCustomizationPending,
  getCustomizationSuccess,
  getCustomizationError,
  SAVE_CUSTOMIZATION_PENDING,
  saveCustomizationSuccess,
  saveCustomizationError,
} from './actions';
import { setCompletedCustomization } from '../onboarded/actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';

import ApiService from '../../../services/api/index';

export const getOnboardedStatus = state => state.onboarded.status;
export const customizationToSave = state => state.customization.toSave;

export function* getCustomizationSaga() {
  try {
    yield put(getCustomizationPending());

    const { path, method } = ApiService.directory.onboard.customization.get();
    const response = yield call(ApiService[method], path);

    yield put(getCustomizationSuccess(response));

    const isOnboarded = yield select(getOnboardedStatus);
    if (!isOnboarded) yield put(setCompletedCustomization(true));
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
    if (!isOnboarded) yield put(setCompletedCustomization(true));
  } catch (err) {
    yield put(saveCustomizationError(err.message));
  }
}

export default function*() {
  yield takeLatest(GET_ON_LOGIN_SUCCESS, getCustomizationSaga);
  yield takeLatest(SAVE_CUSTOMIZATION_PENDING, saveCustomizationSaga);
}
