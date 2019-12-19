import { put, call, takeLatest } from 'redux-saga/effects';

import { getBoardsPending, getBoardsSuccess, getBoardsError } from './actions';
import { AUTHENTICATION_SUCCESS, COOKIE_AUTHENTICATION } from '../auth0/actions';
import ApiService from '../../../services/api/index';
import { normalizeBoards } from '../../helpers';

export function* onLoginSaga() {
  try {
    yield put(getBoardsPending());

    const { path, method } = ApiService.directory.boards();
    const response = yield call(ApiService[method], path);

    const sortedResponse = response.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    const normalize = normalizeBoards(sortedResponse);

    yield put(getBoardsSuccess(normalize));
  } catch (err) {
    yield put(getBoardsError(err.message));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_SUCCESS, onLoginSaga);
  yield takeLatest(COOKIE_AUTHENTICATION, onLoginSaga);
}
