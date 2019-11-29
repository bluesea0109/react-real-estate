import { put, call, takeLatest } from 'redux-saga/effects';

import { AUTHENTICATION_SUCCESS } from '../auth0/actions';
import { getBoardsPending, getBoardsSuccess, getBoardsError } from './actions';
import ApiService from '../../../services/api/index';

export function* onLoginSaga() {
  try {
    yield put(getBoardsPending());

    const { path, method } = ApiService.directory.boards();
    const response = yield call(ApiService[method], path);

    yield put(getBoardsSuccess(response));
  } catch (err) {
    yield put(getBoardsError(err.message));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_SUCCESS, onLoginSaga);
}
