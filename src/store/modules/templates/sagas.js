import { put, call, takeLatest } from 'redux-saga/effects';

import { getTemplatesPending, getTemplatesSuccess, getTemplatesError } from './actions';
import { AUTHENTICATION_SUCCESS, COOKIE_AUTHENTICATION } from '../auth0/actions';
import ApiService from '../../../services/api/index';

export function* getTemplatesSaga() {
  try {
    yield put(getTemplatesPending());

    const { path, method } = ApiService.directory.templates();
    const TemplateResponse = yield call(ApiService[method], path);

    const { stencilPath, stencilMethod } = ApiService.directory.stencils('singleListing');
    const StencilResponse = yield call(ApiService[stencilMethod], stencilPath);

    const { stencilTagPath, stencilTagMethod } = ApiService.directory.stencilsByTag('holiday');
    const StencilTagResponse = yield call(ApiService[stencilTagMethod], stencilTagPath);

    const response = Object.assign(TemplateResponse, StencilResponse);
    response.holiday = [...StencilTagResponse.stencils];

    yield put(getTemplatesSuccess(response));
  } catch (err) {
    yield put(getTemplatesError(err));
  }
}

export default function*() {
  yield takeLatest(AUTHENTICATION_SUCCESS, getTemplatesSaga);
  yield takeLatest(COOKIE_AUTHENTICATION, getTemplatesSaga);
}
