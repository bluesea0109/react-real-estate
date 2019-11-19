import { call, put, select, takeEvery } from '@redux-saga/core/effects';

import { FETCH_MAILOUT_DETAILS_PENDING, fetchMailoutDetailsSuccess, fetchMailoutDetailsError } from './actions';
import ApiService from '../../../services/api/index';

export const getMailoutId = state => state.mailout.mailoutId;

export function* fetchMailoutDetails() {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path } = ApiService.directory.user.mailouts.get(mailoutId);
    const response = yield call(ApiService.get, path);

    yield put(fetchMailoutDetailsSuccess(response));
  } catch (err) {
    yield put(fetchMailoutDetailsError(err.message));
  }
}

export default function*() {
  yield takeEvery(FETCH_MAILOUT_DETAILS_PENDING, fetchMailoutDetails);
}
