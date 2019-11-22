import { call, put, select, takeEvery } from '@redux-saga/core/effects';

import {
  FETCH_MAILOUT_DETAILS_PENDING,
  fetchMailoutDetailsSuccess,
  fetchMailoutDetailsError,
  NEEDS_UPDATE_MAILOUT_DETAILS_PENDING,
  needsUpdateMailoutDetailsSuccess,
  needsUpdateMailoutDetailsError,
  APPROVE_AND_SEND_MAILOUT_DETAILS_PENDING,
  approveAndSendMailoutDetailsSuccess,
  approveAndSendMailoutDetailsError,
  DELETE_MAILOUT_DETAILS_PENDING,
  deleteMailoutDetailsSuccess,
  deleteMailoutDetailsError,
} from './actions';
import ApiService from '../../../services/api/index';

export const getMailoutId = state => state.mailout.mailoutId;

export function* fetchMailoutDetailsSaga() {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = ApiService.directory.user.mailouts.get(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(fetchMailoutDetailsSuccess(response));
  } catch (err) {
    yield put(fetchMailoutDetailsError(err.message));
  }
}

export function* needsUpdateMailoutDetailsSaga() {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = ApiService.directory.user.mailouts.needsUpdate(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(needsUpdateMailoutDetailsSuccess(response));
  } catch (err) {
    yield put(needsUpdateMailoutDetailsError(err.message));
  }
}

export function* approveAndSendMailoutDetailsSaga() {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = ApiService.directory.user.mailouts.approve(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(approveAndSendMailoutDetailsSuccess(response));
  } catch (err) {
    yield put(approveAndSendMailoutDetailsError(err.message));
  }
}

export function* deleteMailoutDetailsSaga() {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = ApiService.directory.user.mailouts.cancel(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(deleteMailoutDetailsSuccess(response));
  } catch (err) {
    yield put(deleteMailoutDetailsError(err.message));
  }
}

export default function*() {
  yield takeEvery(FETCH_MAILOUT_DETAILS_PENDING, fetchMailoutDetailsSaga);
  yield takeEvery(NEEDS_UPDATE_MAILOUT_DETAILS_PENDING, needsUpdateMailoutDetailsSaga);
  yield takeEvery(APPROVE_AND_SEND_MAILOUT_DETAILS_PENDING, approveAndSendMailoutDetailsSaga);
  yield takeEvery(DELETE_MAILOUT_DETAILS_PENDING, deleteMailoutDetailsSaga);
}
