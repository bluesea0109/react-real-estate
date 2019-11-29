import { put, call, takeLatest } from 'redux-saga/effects';

import { AUTHENTICATION_SUCCESS } from '../auth0/actions';
import { getStatesPending, getStatesSuccess, getStatesError } from './actions';
import ApiService from '../../../services/api/index';

export function* onLoginSaga() {
  try {
    yield put(getStatesPending());

    const { path, method } = ApiService.directory.states();
    const response = yield call(ApiService[method], path);

    const normalize = Object.keys(response).map((s, v) => ({ key: s, text: response[s], value: response[s] }));

    yield put(getStatesSuccess(normalize));
  } catch (err) {
    yield put(getStatesError(err.message));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_SUCCESS, onLoginSaga);
}