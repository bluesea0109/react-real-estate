import { call, put, select, takeLatest } from '@redux-saga/core/effects';

import { GET_ADS_TOOL_PENDING, getAdsToolSuccess, getAdsToolError } from './actions';
import ApiService from '../../../services/api/index';

export const getSelectedPeerId = state => state.peer.peerId;
export const getMailoutId = state => state.mailout.mailoutId;

export function* getAdsSaga({ peerId = null }) {
  try {
    const { path, method } = peerId
      ? ApiService.directory.peer.mailout.createAd(peerId)
      : ApiService.directory.user.mailout.createAd();
    const response = yield call(ApiService[method], path);

    yield put(getAdsToolSuccess(response));
  } catch (err) {
    yield put(getAdsToolError(err));
  }
}

export function* checkIfPeerSelectedAdsSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getAdsSaga({ peerId });
  } else {
    yield getAdsSaga({});
  }
}

export default function*() {
  yield takeLatest(GET_ADS_TOOL_PENDING, checkIfPeerSelectedAdsSaga);
}
