import { call, put, select, takeEvery } from '@redux-saga/core/effects';

import {
  GET_MAILOUTS_PENDING,
  getMailoutsSuccess,
  getMailoutsError,
  GET_MORE_MAILOUTS_PENDING,
  setCanFetchMore,
  getMoreMailoutsSuccess,
  getMoreMailoutsError,
  resetMailouts,
} from './actions';
import ApiService from '../../../services/api/index';

export const getMailoutsPage = state => state.mailouts.page;
const limit = 25;

export function* getMailoutSaga() {
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

    yield put(getMailoutsSuccess(response));
  } catch (err) {
    yield put(getMailoutsError(err.message));
  }
}

export function* getMoreMailoutSaga() {
  try {
    const { path, method } = ApiService.directory.user.mailouts.list();
    const page = yield select(getMailoutsPage);
    const response = yield call(ApiService[method], path, { page, limit });

    if (response.length === 0 || response.length < limit) {
      yield put(setCanFetchMore(false));
    } else {
      yield put(setCanFetchMore(true));
    }

    yield put(getMoreMailoutsSuccess(response));
  } catch (err) {
    yield put(getMoreMailoutsError(err.message));
  }
}

export default function*() {
  yield takeEvery(GET_MAILOUTS_PENDING, getMailoutSaga);
  yield takeEvery(GET_MORE_MAILOUTS_PENDING, getMoreMailoutSaga);
}
