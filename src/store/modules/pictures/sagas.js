import { put, call, select, takeLatest } from 'redux-saga/effects';

import {
  getPhotoPending,
  getPhotoSuccess,
  getPhotoError,
  UPLOAD_PHOTO_PENDING,
  uploadPhotoSuccess,
  uploadPhotoError,
  DELETE_PHOTO_PENDING,
  deletePhotoSuccess,
  deletePhotoError,
} from './actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';
import { DESELECT_PEER_ID, SELECT_PEER_ID } from '../peer/actions';

import ApiService from '../../../services/api/index';
export const getSelectedPeerId = state => state.peer.peerId;
export const getPhotoToUpload = state => state.pictures.toUpload;
export const getPhotoToDelete = state => state.pictures.toDelete;
const s3BucketURL = 'https://alf-gabbi-uploads.s3.amazonaws.com/';

export function* getPhotoSaga({ peerId = null }) {
  try {
    yield put(getPhotoPending());
    const { path, method } = peerId
      ? ApiService.directory.peer.photos.realtorPhoto.get(peerId)
      : ApiService.directory.user.photos.realtorPhoto.get();

    const response = yield call(ApiService[method], path);

    yield put(getPhotoSuccess(response));
  } catch (err) {
    yield put(getPhotoError(err));
  }
}

export function* uploadPhotoSaga({ peerId = null }) {
  const targetArr = yield select(getPhotoToUpload);

  const targetKey = targetArr[0];
  const targetFile = targetArr[1];

  const { path, method } = yield targetKey === 'realtorPhoto'
    ? peerId
      ? ApiService.directory.peer.photos.realtorPhoto.set(peerId)
      : ApiService.directory.user.photos.realtorPhoto.set()
    : targetKey === 'teamLogo'
    ? ApiService.directory.onboard.fillInYourProfile.photos.teamLogo.set()
    : targetKey === 'brokerageLogo'
    ? ApiService.directory.onboard.fillInYourProfile.photos.brokerageLogo.set()
    : {};

  try {
    const data = yield new FormData();
    data.append(targetKey, targetFile);

    const response = yield call(ApiService[method], path, data);
    const normalizedResponse = Object.assign({}, response, {
      resized: `${s3BucketURL}${response.resized}`,
      original: `${s3BucketURL}${response.original}`,
    });

    yield put(uploadPhotoSuccess({ target: targetKey, data: normalizedResponse }));
  } catch (err) {
    yield put(uploadPhotoError({ target: targetKey, data: err }));
  }
}

export function* deletePhotoSaga() {
  try {
    const target = yield select(getPhotoToDelete);

    const { path, method } = yield target === 'teamLogo'
      ? ApiService.directory.onboard.fillInYourProfile.photos.teamLogo.delete()
      : {};

    yield call(ApiService[method], path);

    yield put(deletePhotoSuccess({ target: target }));
  } catch (err) {
    yield put(deletePhotoError(err));
  }
}

export function* checkIfPeerSelectedGetPhotoSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield getPhotoSaga({ peerId });
  } else {
    yield getPhotoSaga({});
  }
}

export function* checkIfPeerSelectedUploadPhotoSaga() {
  const peerId = yield select(getSelectedPeerId);

  if (peerId) {
    yield uploadPhotoSaga({ peerId });
  } else {
    yield uploadPhotoSaga({});
  }
}

export default function*() {
  yield takeLatest(GET_ON_LOGIN_SUCCESS, checkIfPeerSelectedGetPhotoSaga);
  yield takeLatest(DESELECT_PEER_ID, checkIfPeerSelectedGetPhotoSaga);
  yield takeLatest(SELECT_PEER_ID, checkIfPeerSelectedGetPhotoSaga);
  yield takeLatest(UPLOAD_PHOTO_PENDING, checkIfPeerSelectedUploadPhotoSaga);
  yield takeLatest(DELETE_PHOTO_PENDING, deletePhotoSaga);
}
