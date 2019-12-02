import { put, call, takeLatest } from 'redux-saga/effects';

import { getStatesPending, getStatesSuccess, getStatesError } from './actions';
import { AUTHENTICATION_SUCCESS } from '../auth0/actions';
import ApiService from '../../../services/api/index';
import { normalizeStates } from '../../helpers';

export function* onLoginSaga() {
  try {
    yield put(getStatesPending());

    const { path, method } = ApiService.directory.states();
    const response = yield call(ApiService[method], path);

    const normalize = normalizeStates(response);

    yield put(getStatesSuccess(normalize));
  } catch (err) {
    yield put(getStatesError(err.message));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_SUCCESS, onLoginSaga);
}
