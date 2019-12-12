import { put, select, takeLatest } from 'redux-saga/effects';

import { setCompletedProfile } from './actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';

export const getSetupComplete = state => state.onLogin && state.onLogin.userProfile;

export function* onboardedSaga() {
  try {
    const userProfile = yield select(getSetupComplete);

    if (userProfile && userProfile.setupComplete) {
      yield put(setCompletedProfile(true));
    }
  } catch (err) {
    console.log('onboardedSaga err', err);
  }
}

export default function*() {
  yield takeLatest(GET_ON_LOGIN_SUCCESS, onboardedSaga);
}
