import { call, put, takeEvery } from '@redux-saga/core/effects';
import { FETCH_MAILOUT_PENDING, fetchMailoutsSuccess, fetchMailoutsError } from './actions';
import ApiService from '../../../services/api/index';

export function* fetchMailout() {
  try {
    const { path } = ApiService.directory.user.mailouts.list();
    const response = yield call(ApiService.get, path);

    yield put(fetchMailoutsSuccess(response.results));
  } catch (err) {
    yield put(fetchMailoutsError(err.message));
  }
}

export default function*() {
  yield takeEvery(FETCH_MAILOUT_PENDING, fetchMailout);
}
