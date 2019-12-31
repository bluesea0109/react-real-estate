import { call, put, select, takeLatest } from 'redux-saga/effects';

import { setCompletedProfile, setCompletedTeamCustomization, setCompletedCustomization, setCompletedInviteTeammates, finalizeOnboarding } from './actions';

import { GET_ON_LOGIN_SUCCESS } from '../onLogin/actions';
import { SAVE_PROFILE_SUCCESS } from '../profile/actions';
import { SAVE_TEAM_PROFILE_SUCCESS } from '../teamProfile/actions';
import { REVIEW_CUSTOMIZATION_COMPLETED } from '../customization/actions';
import { REVIEW_TEAM_CUSTOMIZATION_COMPLETED } from '../teamCustomization/actions';
import { INVITE_USERS_SUCCESS, SKIP_INVITE_USERS } from '../inviteUsers/actions';

import ApiService from '../../../services/api';

export const onLoginMode = state => state.onLogin && state.onLogin.mode;
export const onLoginPermissionsTeamAdmin = state => state.onLogin && state.onLogin.permissions && state.onLogin.permissions.teamAdmin;

export const onLoginUserBranding = state => state.onLogin && state.onLogin.userBranding;
export const onLoginTeamBranding = state => state.onLogin && state.onLogin.teamBranding;

export const onboardingProfileSetupComplete = state => state.onLogin && state.onLogin.userProfile && state.onLogin.userProfile.setupComplete;
export const onboardingComplete = state => state.onLogin && state.onLogin.userBranding && state.onLogin.userBranding.onboardingComplete;

let userProfileCompleted = false;
let teamProfileCompleted = false;

export function* profileSetupOnboardingSaga() {
  try {
    const mode = yield select(onLoginMode);
    const multiUser = mode === 'multiuser';
    const singleuser = mode === 'singleuser';
    const userIsAdmin = yield select(onLoginPermissionsTeamAdmin);

    userProfileCompleted = true;

    if ((!multiUser && !userIsAdmin) || (multiUser && teamProfileCompleted) || (singleuser && teamProfileCompleted)) {
      yield put(setCompletedProfile());
    }
  } catch (err) {
    yield console.log('profileSetupOnboardingSaga err', err);
  }
}

export function* teamProfileSetupOnboardingSaga() {
  try {
    const mode = yield select(onLoginMode);
    const multiUser = mode === 'multiuser';
    const singleuser = mode === 'singleuser';

    teamProfileCompleted = true;

    if ((multiUser && userProfileCompleted) || (singleuser && userProfileCompleted)) yield put(setCompletedProfile());
  } catch (err) {
    yield console.log('profileSetupOnboardingSaga err', err);
  }
}

export function* teamCustomizationOnboardingSaga() {
  try {
    yield put(setCompletedTeamCustomization());
  } catch (err) {
    yield console.log('teamCustomizationOnboardingSaga err', err);
  }
}

export function* customizationOnboardingSaga() {
  try {
    const mode = yield select(onLoginMode);
    const multiUser = mode === 'multiuser';
    const singleuser = mode === 'singleuser';
    const userIsAdmin = yield select(onLoginPermissionsTeamAdmin);

    yield put(setCompletedCustomization());
    if (multiUser && !userIsAdmin) yield put(finalizeOnboarding());
    if (singleuser) yield put(finalizeOnboarding());
  } catch (err) {
    yield console.log('customizationOnboardingSaga err', err);
  }
}

export function* finalizeOnboardingGetCustomizationSaga() {
  try {
    const { path, method } = ApiService.directory.user.customization.get();
    return yield call(ApiService[method], path);
  } catch (err) {
    yield console.log('finalizeOnboardingGetCustomizationSaga err', err);
  }
}

export function* finalizeOnboardingSaveCustomizationSaga(currentCustomization) {
  try {
    currentCustomization.onboardingComplete = Date.now();

    const { path, method } = ApiService.directory.onboard.customization.save();
    return yield call(ApiService[method], path, currentCustomization);
  } catch (err) {
    yield console.log('finalizeOnboardingSaveCustomizationSaga err', err);
  }
}

export function* invitationOnboardingSaga() {
  try {
    const currentCustomization = yield finalizeOnboardingGetCustomizationSaga();
    const updatedCustomization = yield finalizeOnboardingSaveCustomizationSaga(currentCustomization);

    yield console.log('invitationOnboardingSaga updatedCustomization', updatedCustomization);

    yield put(setCompletedInviteTeammates());
    yield put(finalizeOnboarding());
  } catch (err) {
    yield console.log('invitationOnboardingSaga err', err);
  }
}

export function* initialOnboardingSaga() {
  try {
    const onboarded = yield select(onboardingComplete);
    const stageOneCompleted = yield select(onboardingProfileSetupComplete);

    const userBrandingPresent = yield select(onLoginUserBranding);
    const teamBrandingPresent = yield select(onLoginTeamBranding);

    if (onboarded) {
      yield put(finalizeOnboarding());
    } else {
      if (stageOneCompleted) {
        yield put(setCompletedProfile());
      }

      if (teamBrandingPresent) {
        yield teamCustomizationOnboardingSaga();
      }
      if (userBrandingPresent) {
        yield customizationOnboardingSaga();
      }
    }
  } catch (err) {
    yield console.log('initialOnboardingSaga err', err);
  }
}

export default function*() {
  yield takeLatest(GET_ON_LOGIN_SUCCESS, initialOnboardingSaga);
  yield takeLatest(SAVE_PROFILE_SUCCESS, profileSetupOnboardingSaga);
  yield takeLatest(SAVE_TEAM_PROFILE_SUCCESS, teamProfileSetupOnboardingSaga);
  yield takeLatest(REVIEW_TEAM_CUSTOMIZATION_COMPLETED, teamCustomizationOnboardingSaga);
  yield takeLatest(REVIEW_CUSTOMIZATION_COMPLETED, customizationOnboardingSaga);
  yield takeLatest(INVITE_USERS_SUCCESS, invitationOnboardingSaga);
  yield takeLatest(SKIP_INVITE_USERS, invitationOnboardingSaga);
}
