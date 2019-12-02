import { put, call, takeLatest } from 'redux-saga/effects';

import { getBoardsPending, getBoardsSuccess, getBoardsError } from './actions';
import { AUTHENTICATION_SUCCESS } from '../auth0/actions';
import ApiService from '../../../services/api/index';
import { normalizeBoards } from '../../helpers';

export function* onLoginSaga() {
  try {
    yield put(getBoardsPending());

    const { path, method } = ApiService.directory.boards();
    const response = yield call(ApiService[method], path);

    const normalize = normalizeBoards(response);

    yield put(getBoardsSuccess(normalize));
  } catch (err) {
    yield put(getBoardsError(err.message));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_SUCCESS, onLoginSaga);
}
