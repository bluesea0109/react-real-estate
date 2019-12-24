import { call, put, select, takeEvery } from '@redux-saga/core/effects';

import {
  GET_MAILOUT_DETAILS_PENDING,
  getMailoutDetailsSuccess,
  getMailoutDetailsError,
  NEEDS_UPDATE_MAILOUT_DETAILS_PENDING,
  needsUpdateMailoutDetailsSuccess,
  needsUpdateMailoutDetailsError,
  APPROVE_AND_SEND_MAILOUT_DETAILS_PENDING,
  approveAndSendMailoutDetailsSuccess,
  approveAndSendMailoutDetailsError,
  DELETE_MAILOUT_DETAILS_PENDING,
  deleteMailoutDetailsSuccess,
  deleteMailoutDetailsError,
  SAVE_MAILOUT_DETAILS_MAILOUT_SIZE_PENDING,
  saveMailoutDetailsMailoutSizeSuccess,
  saveMailoutDetailsMailoutSizeError,
} from './actions';
import ApiService from '../../../services/api/index';

export const getMailoutId = state => state.mailout.mailoutId;
export const getMailoutSize = state => state.mailout.mailoutSize;

export function* getMailoutDetailsSaga() {
  try {
    const mailoutId = yield select(getMailoutId);
    const { path, method } = ApiService.directory.user.mailouts.get(mailoutId);
    const response = yield call(ApiService[method], path);

    yield put(getMailoutDetailsSuccess(response));
  } catch (err) {
    yield put(getMailoutDetailsError(err.message));
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

export function* updatetMailoutDetailsMailoutSizeSaga() {
  try {
    const mailoutId = yield select(getMailoutId);
    const mailoutSize = yield select(getMailoutSize);
    const { path, method } = ApiService.directory.user.mailouts.mailoutSize(mailoutId);

    const data = { mailoutSize: parseInt(mailoutSize, 10) };
    const response = yield call(ApiService[method], path, data);

    console.log('updatetMailoutDetailsMailoutSizeSaga', response);

    yield put(saveMailoutDetailsMailoutSizeSuccess(response));
  } catch (err) {
    yield put(saveMailoutDetailsMailoutSizeError(err.message));
  }
}

export default function*() {
  yield takeEvery(GET_MAILOUT_DETAILS_PENDING, getMailoutDetailsSaga);
  yield takeEvery(NEEDS_UPDATE_MAILOUT_DETAILS_PENDING, needsUpdateMailoutDetailsSaga);
  yield takeEvery(APPROVE_AND_SEND_MAILOUT_DETAILS_PENDING, approveAndSendMailoutDetailsSaga);
  yield takeEvery(DELETE_MAILOUT_DETAILS_PENDING, deleteMailoutDetailsSaga);
  yield takeEvery(SAVE_MAILOUT_DETAILS_MAILOUT_SIZE_PENDING, updatetMailoutDetailsMailoutSizeSaga);
}
