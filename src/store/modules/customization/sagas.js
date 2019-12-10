import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  getCustomizationPending,
  getCustomizationSuccess,
  getCustomizationError,
  SAVE_CUSTOMIZATION_PENDING,
  saveCustomizationSuccess,
  saveCustomizationError,
} from './actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';

import ApiService from '../../../services/api/index';

export const customizationToSave = state => state.customization.toSave;

export function* getCustomizationSaga() {
  try {
    yield put(getCustomizationPending());

    const { path, method } = ApiService.directory.onboard.customization.get();
    const response = yield call(ApiService[method], path);

    delete response._id;
    delete response._rev;

    yield put(getCustomizationSuccess(response));
  } catch (err) {
    yield put(getCustomizationError(err.message));
  }
}

export function* saveCustomizationSaga() {
  try {
    const customization = yield select(customizationToSave);

    const { path, method } = ApiService.directory.onboard.customization.save();
    const response = yield call(ApiService[method], path, customization);

    delete response._id;
    delete response._rev;

    yield put(saveCustomizationSuccess(response));
  } catch (err) {
    yield put(saveCustomizationError(err.message));
  }
}

export default function*() {
  yield takeLatest(GET_ON_LOGIN_SUCCESS, getCustomizationSaga);
  yield takeLatest(SAVE_CUSTOMIZATION_PENDING, saveCustomizationSaga);
}
