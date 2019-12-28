import { put, call, select, takeLatest } from 'redux-saga/effects';

import { GET_PROFILE_PENDING, getProfileSuccess, getProfileError, SAVE_PROFILE_PENDING, saveProfileSuccess, saveProfileError } from './actions';
import ApiService from '../../../services/api/index';

export const getSelectedPeerId = state => state.peer.peerId;
export const profileToSave = state => state.profile.toSave;

export function* getProfileSaga({ peerId = null }) {
  try {
    const { path, method } = peerId ? ApiService.directory.peer.profile.get(peerId) : ApiService.directory.user.profile.get();
    const response = yield call(ApiService[method], path);

    yield put(getProfileSuccess(response));
  } catch (err) {
    yield put(getProfileError(err.message));
  }
}

export function* saveProfileSaga({ peerId = null }) {
  try {
    const profile = yield select(profileToSave);

    const { path, method } = peerId ? ApiService.directory.peer.profile.save(peerId) : ApiService.directory.user.profile.save();
    const response = yield call(ApiService[method], path, profile);

    yield put(saveProfileSuccess(response));
  } catch (err) {
    yield put(saveProfileError(err.message));
  }
}

export function* checkIfPeerSelectedGetProfileSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getProfileSaga({ peerId });
  } else {
    yield getProfileSaga({});
  }
}

export function* checkIfPeerSelectedSaveProfileSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield saveProfileSaga({ peerId });
  } else {
    yield saveProfileSaga({});
  }
}

export default function*() {
  yield takeLatest(GET_PROFILE_PENDING, checkIfPeerSelectedGetProfileSaga);
  yield takeLatest(SAVE_PROFILE_PENDING, checkIfPeerSelectedSaveProfileSaga);
}
