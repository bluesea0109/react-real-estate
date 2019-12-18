import { put, select, takeLatest } from 'redux-saga/effects';

import { setCompletedProfile, setCompletedTeamCustomization, setCompletedInviteTeammates } from './actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';
import { SAVE_TEAM_PROFILE_SUCCESS } from '../teamProfile/actions';
import { SAVE_PROFILE_SUCCESS } from '../profile/actions';

export const getSetupComplete = state => state.onLogin && state.onLogin.userProfile;
export const checkIfUserIsAdmin = state => state.onLogin && state.onLogin.permissions && state.onLogin.permissions.teamAdmin;

export const getUserProfile = state => state.profile && state.profile.available;
export const getTeamProfile = state => state.teamProfile && state.teamProfile.available;

export function* onboardedCompleteProfileSetupSaga() {
  try {
    const userProfileIsAvailable = yield select(getUserProfile);
    const teamProfileIsAvailable = yield select(getTeamProfile);

    if (userProfileIsAvailable && teamProfileIsAvailable) {
      yield put(setCompletedProfile(true));
    }
  } catch (err) {
    console.log('completeProfileSetupSaga err', err);
  }
}

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
  yield takeLatest(SAVE_TEAM_PROFILE_SUCCESS, onboardedCompleteProfileSetupSaga);
  yield takeLatest(SAVE_PROFILE_SUCCESS, onboardedCompleteProfileSetupSaga);
}
