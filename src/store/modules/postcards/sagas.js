import { put, call, takeLatest } from 'redux-saga/effects';

import { GENERATE_POSTCARDS_PREVIEW_PENDING, generatePostcardsPreviewSuccess, generatePostcardsPreviewError } from './actions';
import ApiService from '../../../services/api/index';

export function* getPostcardsPreviewSaga() {
  try {
    const { path, method } = ApiService.directory.onboard.customization.generatePostcardPreview();
    const response = yield call(ApiService[method], path);

    yield put(generatePostcardsPreviewSuccess(response));
  } catch (err) {
    yield put(generatePostcardsPreviewError(err.message));
  }
}

export default function*() {
  yield takeLatest(GENERATE_POSTCARDS_PREVIEW_PENDING, getPostcardsPreviewSaga);
}
