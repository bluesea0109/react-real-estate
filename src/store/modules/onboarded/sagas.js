// import { call } from 'redux-saga/effects';
import { put, select, takeLatest } from 'redux-saga/effects';

import {
  setCompletedProfile,
  setCompletedTeamCustomization,
  setCompletedInviteTeammates,
  // finalizeOnboarding,
  // setCompletedCustomization,
  // FINALIZE_ONBOARDING,
} from './actions';
// import {
//   getCustomizationError,
//   getCustomizationPending,
//   getCustomizationSuccess,
//   saveCustomizationError,
//   saveCustomizationSuccess
// } from '../customization/actions';
import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';
import { SAVE_TEAM_PROFILE_SUCCESS } from '../teamProfile/actions';
import { SAVE_PROFILE_SUCCESS } from '../profile/actions';
// import {getOnboardedStatus, getOnLoginMode, getTeamCustomizationSaga} from "../teamCustomization/sagas";
// import {
//   getTeamCustomizationError,
//   getTeamCustomizationPending,
//   getTeamCustomizationSuccess
// } from "../teamCustomization/actions";
// import ApiService from "../../../services/api";
// import ApiService from '../../../services/api';
//
// export const getOnLoginMode = state => state.onLogin.mode;
// export const getOnboardedStatus = state => state.onboarded.status;
//
// export const getCurrentCustomization = state => state.customization.available;

export const getUserProfile = state => state.profile && state.profile.available;
export const getTeamProfile = state => state.teamProfile && state.teamProfile.available;

export const getSetupComplete = state => state.onLogin && state.onLogin.userProfile;
export const checkIfUserIsAdmin = state => state.onLogin && state.onLogin.permissions && state.onLogin.permissions.teamAdmin;

export const getOnLoginMode = state => state.onLogin.mode;
// export const getOnboardedStatus = state => state.onboarded.status;

// export function* finalizeOnboardingSaga() {
//   try {
//     const currentCustomization = yield select(getCurrentCustomization);
//
//     currentCustomization.onboardingComplete = Date.now();
//
//     const { path, method } = ApiService.directory.onboard.customization.save();
//     const response = yield call(ApiService[method], path, currentCustomization);
//
//     yield put(saveCustomizationSuccess(response));
//   } catch (err) {
//     yield put(saveCustomizationError(err.message));
//   }
// }

// export function* getCustomizationSaga() {
//   try {
//     yield put(getCustomizationPending());
//
//     const { path, method } = ApiService.directory.onboard.customization.get();
//     const response = yield call(ApiService[method], path);
//
//     yield put(getCustomizationSuccess(response));
//
//     if (response.onboardingComplete) yield put(finalizeOnboarding());
//
//     const isOnboarded = yield select(getOnboardedStatus);
//     const mode = yield select(getOnLoginMode);
//     const userIsAdmin = yield select(checkIfUserIsAdmin);
//     if (!isOnboarded) yield put(setCompletedCustomization(true));
//     if (!isOnboarded && mode !== 'multiuser') yield put(finalizeOnboarding());
//     if (!isOnboarded && mode === 'multiuser' && !userIsAdmin) yield put(finalizeOnboarding());
//   } catch (err) {
//     yield put(getCustomizationError(err.message));
//   }
// }

// export function* getTeamCustomizationSaga() {
//   try {
//     yield put(getTeamCustomizationPending());
//
//     const { path, method } = ApiService.directory.onboard.teamCustomization.get();
//     const response = yield call(ApiService[method], path);
//
//     yield put(getTeamCustomizationSuccess(response));
//     const isOnboarded = yield select(getOnboardedStatus);
//     if (!isOnboarded) yield put(setCompletedTeamCustomization(true));
//   } catch (err) {
//     yield put(getTeamCustomizationError(err.message));
//   }
// }

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

// export function* checkIfMultiUser() {
//   const mode = yield select(getOnLoginMode);
//
//   if (mode === 'multiuser') {
//     yield getTeamCustomizationSaga();
//   }
// }

export default function*() {
  // yield takeLatest(GET_ON_LOGIN_SUCCESS, checkIfMultiUser);
  yield takeLatest(GET_ON_LOGIN_SUCCESS, onboardedSaga);
  // yield takeLatest(GET_ON_LOGIN_SUCCESS, getCustomizationSaga);
  yield takeLatest(SAVE_TEAM_PROFILE_SUCCESS, onboardedCompleteProfileSetupSaga);
  yield takeLatest(SAVE_PROFILE_SUCCESS, onboardedCompleteProfileSetupSaga);
  // yield takeLatest(FINALIZE_ONBOARDING, finalizeOnboardingSaga);
}
