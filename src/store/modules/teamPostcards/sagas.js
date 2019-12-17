import { put, call, takeLatest } from 'redux-saga/effects';

import { GENERATE_TEAM_POSTCARDS_PREVIEW_PENDING, generateTeamPostcardsPreviewSuccess, generateTeamPostcardsPreviewError } from './actions';
import ApiService from '../../../services/api/index';

export function* getTeamPostcardsPreviewSaga() {
  try {
    const { path, method } = ApiService.directory.onboard.teamCustomization.generatePostcardPreview();
    const response = yield call(ApiService[method], path);

    yield put(generateTeamPostcardsPreviewSuccess(response));
  } catch (err) {
    yield put(generateTeamPostcardsPreviewError(err.message));
  }
}

export default function*() {
  yield takeLatest(GENERATE_TEAM_POSTCARDS_PREVIEW_PENDING, getTeamPostcardsPreviewSaga);
}
