import { put, select, takeLatest } from 'redux-saga/effects';

import { setCompletedProfile, setCompletedTeamCustomization, setCompletedInviteTeammates } from './actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';

export const getSetupComplete = state => state.onLogin && state.onLogin.userProfile;
export const checkIfUserIsAdmin = state => state.onLogin && state.onLogin.permissions && state.onLogin.permissions.teamAdmin;

export function* onboardedSaga() {
  try {
    const userProfile = yield select(getSetupComplete);
    const userIsAdmin = yield select(checkIfUserIsAdmin);

    if (!userIsAdmin) {
      yield put(setCompletedTeamCustomization(true));
      yield put(setCompletedInviteTeammates(true));
    }

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
