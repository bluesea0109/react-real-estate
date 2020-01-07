import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  GET_CUSTOMIZATION_PENDING,
  getCustomizationSuccess,
  getCustomizationError,
  SAVE_CUSTOMIZATION_PENDING,
  saveCustomizationSuccess,
  saveCustomizationError,
  reviewCustomizationCompleted,
} from './actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';
import { generatePostcardsPreviewPending } from '../postcards/actions';
import ApiService from '../../../services/api/index';

export const getSelectedPeerId = state => state.peer.peerId;
export const customizationToSave = state => state.customization.toSave;
function objectIsEmpty(obj) {
  return !obj || Object.keys(obj).length === 0;
}

export function* peerListingInitialSaga(peerId) {
  try {
    const { path, method } = ApiService.directory.peer.listing.initial(peerId);
    return yield call(ApiService[method], path);
  } catch (err) {
    yield console.log('peerListingInitialSaga err', err);
  }
}

export function* getCustomizationSaga({ peerId = null }) {
  try {
    const { path, method } = peerId ? ApiService.directory.peer.customization.get(peerId) : ApiService.directory.user.customization.get();
    const response = yield call(ApiService[method], path);

    yield put(getCustomizationSuccess(response));
  } catch (err) {
    yield put(getCustomizationError(err.message));
  }
}

export function* saveCustomizationSaga({ peerId = null }) {
  try {
    let customization = yield select(customizationToSave);
    const emptyCustomization = objectIsEmpty(customization);

    if (emptyCustomization) customization = { _id: undefined, _rev: undefined };

    const { path, method } = peerId ? ApiService.directory.peer.customization.save(peerId) : ApiService.directory.user.customization.save();
    const response = yield call(ApiService[method], path, customization);

    yield put(saveCustomizationSuccess(response));
    if (!emptyCustomization) yield put(generatePostcardsPreviewPending());
    if (emptyCustomization) yield put(reviewCustomizationCompleted());

    if (peerId) {
      const peerListingsInitial = yield peerListingInitialSaga(peerId);
      yield console.log('saveCustomizationSaga peerListingsInitial', peerListingsInitial);
    }
  } catch (err) {
    yield put(saveCustomizationError(err.message));
  }
}

export function* checkIfPeerSelectedGetCustomizationSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getCustomizationSaga({ peerId });
  } else {
    yield getCustomizationSaga({});
  }
}

export function* checkIfPeerSelectedSaveCustomizationSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield saveCustomizationSaga({ peerId });
  } else {
    yield saveCustomizationSaga({});
  }
}

export default function*() {
  yield takeLatest(GET_CUSTOMIZATION_PENDING, checkIfPeerSelectedGetCustomizationSaga);
  yield takeLatest(SAVE_CUSTOMIZATION_PENDING, checkIfPeerSelectedSaveCustomizationSaga);
  yield takeLatest(GET_ON_LOGIN_SUCCESS, checkIfPeerSelectedGetCustomizationSaga);
}
