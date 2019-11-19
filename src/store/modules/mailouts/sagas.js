import { call, put, select, takeEvery } from '@redux-saga/core/effects';

import { FETCH_MAILOUT_PENDING, fetchMailoutsSuccess, fetchMailoutsError, CHANGE_FETCH_MAILOUT_PAGE, CHANGE_FETCH_MAILOUT_LIMIT } from './actions';
import ApiService from '../../../services/api/index';

export const getMailoutsPage = state => state.mailouts.page;
export const getMailoutsLimit = state => state.mailouts.limit;

export function* fetchMailout() {
  try {
    const { path } = ApiService.directory.user.mailouts.list();
    const page = yield select(getMailoutsPage);
    const limit = yield select(getMailoutsLimit);
    const response = yield call(ApiService.get, path, { page, limit });

    yield put(fetchMailoutsSuccess(response));
  } catch (err) {
    yield put(fetchMailoutsError(err.message));
  }
}

export default function*() {
  yield takeEvery(FETCH_MAILOUT_PENDING, fetchMailout);
  yield takeEvery(CHANGE_FETCH_MAILOUT_PAGE, fetchMailout);
  yield takeEvery(CHANGE_FETCH_MAILOUT_LIMIT, fetchMailout);
}
