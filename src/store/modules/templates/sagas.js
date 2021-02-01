import { put, call, takeLatest } from 'redux-saga/effects';

import { getTemplatesPending, getTemplatesSuccess, getTemplatesError } from './actions';
import { AUTHENTICATION_SUCCESS, COOKIE_AUTHENTICATION } from '../auth0/actions';
import ApiService from '../../../services/api/index';

export function* getTemplatesSaga() {
  try {
    yield put(getTemplatesPending());

    const { stencilPath, stencilMethod } = ApiService.directory.stencils('singleListing');
    const StencilResponse = yield call(ApiService[stencilMethod], stencilPath);

    const {
      stencilTagPath: holidayPath,
      stencilTagMethod: holidayMethod,
    } = ApiService.directory.stencilsByTag('holiday');
    const holidayResponse = yield call(ApiService[holidayMethod], holidayPath);

    const {
      stencilTagPath: generalPath,
      stencilTagMethod: generalMethod,
    } = ApiService.directory.stencilsByTag('general');
    const generalResponse = yield call(ApiService[generalMethod], generalPath);

    const { stencilIntentPath, stencilIntentMethod } = ApiService.directory.stencilsByIntent();
    const byIntentResponse = yield call(ApiService[stencilIntentMethod], stencilIntentPath);

    const response = Object.assign(StencilResponse);
    response.holiday = [...holidayResponse.stencils];
    response.general = [...generalResponse.stencils];
    response.byIntent = [...byIntentResponse.stencils];

    yield put(getTemplatesSuccess(response));
  } catch (err) {
    yield put(getTemplatesError(err));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_SUCCESS, getTemplatesSaga);
  yield takeLatest(COOKIE_AUTHENTICATION, getTemplatesSaga);
}
