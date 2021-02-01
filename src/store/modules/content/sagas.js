import {
  getReadyMadeContentPending,
  getReadyMadeContentSuccess,
  getReadyMadeContentError,
} from './actions';
import { AUTHENTICATION_SUCCESS, COOKIE_AUTHENTICATION } from '../auth0/actions';
import ApiService from '../../../services/api/index';
import { call, put, takeLatest } from '@redux-saga/core/effects';

export function* getReadyMadeContentSaga() {
  try {
    yield put(getReadyMadeContentPending());
    const { path, method } = ApiService.directory.user.content();
    const response = yield call(ApiService[method], path);
    yield put(getReadyMadeContentSuccess(response));
  } catch (err) {
    yield put(getReadyMadeContentError(err));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_SUCCESS, getReadyMadeContentSaga);
  yield takeLatest(COOKIE_AUTHENTICATION, getReadyMadeContentSaga);
}
