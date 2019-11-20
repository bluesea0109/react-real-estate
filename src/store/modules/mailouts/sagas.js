import { call, put, select, takeEvery } from '@redux-saga/core/effects';

import {
  FETCH_MAILOUTS_PENDING,
  fetchMailoutsSuccess,
  fetchMailoutsError,
  FETCH_MORE_MAILOUTS_PENDING,
  setCanFetchMore,
  fetchMoreMailoutsSuccess,
  fetchMoreMailoutsError,
  resetMailouts,
} from './actions';
import ApiService from '../../../services/api/index';

export const getMailoutsPage = state => state.mailouts.page;
const limit = 25;

export function* fetchMailoutSaga() {
  try {
    const { path, method } = ApiService.directory.user.mailouts.list();
    yield put(resetMailouts());
    const page = yield select(getMailoutsPage);
    const response = yield call(ApiService[method], path, { page, limit });

    if (response.length === 0 || response.length < limit) {
      yield put(setCanFetchMore(false));
    } else {
      yield put(setCanFetchMore(true));
    }

    yield put(fetchMailoutsSuccess(response));
  } catch (err) {
    yield put(fetchMailoutsError(err.message));
  }
}

export function* fetchMoreMailoutSaga() {
  try {
    const { path, method } = ApiService.directory.user.mailouts.list();
    const page = yield select(getMailoutsPage);
    const response = yield call(ApiService[method], path, { page, limit });

    if (response.length === 0 || response.length < limit) {
      yield put(setCanFetchMore(false));
    } else {
      yield put(setCanFetchMore(true));
    }

    yield put(fetchMoreMailoutsSuccess(response));
  } catch (err) {
    yield put(fetchMoreMailoutsError(err.message));
  }
}

export default function*() {
  yield takeEvery(FETCH_MAILOUTS_PENDING, fetchMailoutSaga);
  yield takeEvery(FETCH_MORE_MAILOUTS_PENDING, fetchMoreMailoutSaga);
}
