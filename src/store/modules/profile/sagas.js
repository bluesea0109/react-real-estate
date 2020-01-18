import _ from 'lodash';
import { put, call, select, takeLatest } from 'redux-saga/effects';

import { GET_PROFILE_PENDING, getProfileSuccess, getProfileError, SAVE_PROFILE_PENDING, saveProfileSuccess, saveProfileError } from './actions';
import ApiService from '../../../services/api/index';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';
import { DESELECT_PEER_ID, SELECT_PEER_ID } from '../peer/actions';
import { generateMailoutsError, generateMailoutsPending, generateMailoutsSuccess } from '../mailouts/actions';
import { initializeUserPollingStart } from '../initialize/actions';

export const getSelectedPeerId = state => state.peer.peerId;
export const getExistingProfile = state => state.profile.available;
export const profileToSave = state => state.profile.toSave;

export function* getProfileSaga({ peerId = null }) {
  try {
    const { path, method } = peerId ? ApiService.directory.peer.profile.get(peerId) : ApiService.directory.user.profile.get();
    const response = yield call(ApiService[method], path);

    yield put(getProfileSuccess(response));
  } catch (err) {
    yield put(getProfileError(err));
  }
}

export function* reInitializeListingSaga({ peerId = null }) {
  try {
    yield put(generateMailoutsPending());

    const { path, method } = peerId ? ApiService.directory.peer.listing.initial(peerId) : ApiService.directory.user.listing.initial();
    const response = yield call(ApiService[method], path);

    yield put(generateMailoutsSuccess(response));
    yield put(initializeUserPollingStart());
  } catch (err) {
    yield put(generateMailoutsError(err));
  }
}

export function* saveProfileSaga({ peerId = null }) {
  try {
    const existingProfile = yield select(getExistingProfile);
    const newProfile = yield select(profileToSave);
    const boardsDiffer = existingProfile && !_.isEqual(existingProfile.boards, newProfile.boards);

    const { path, method } = peerId ? ApiService.directory.peer.profile.save(peerId) : ApiService.directory.user.profile.save();
    const response = yield call(ApiService[method], path, newProfile);

    yield put(saveProfileSuccess(response));

    if (boardsDiffer) {
      if (peerId) {
        yield reInitializeListingSaga({ peerId });
      } else {
        yield reInitializeListingSaga({});
      }
    }
  } catch (err) {
    yield put(saveProfileError(err));
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
  yield takeLatest(GET_ON_LOGIN_SUCCESS, checkIfPeerSelectedGetProfileSaga);
  yield takeLatest(SELECT_PEER_ID, checkIfPeerSelectedGetProfileSaga);
  yield takeLatest(DESELECT_PEER_ID, checkIfPeerSelectedGetProfileSaga);
}
