import { createAction } from '../../helpers';

export const FINALIZE_ONBOARDING = 'FINALIZE_ONBOARDING';
export const SET_COMPLETED_PROFILE = 'SET_COMPLETED_PROFILE';
export const SET_COMPLETED_TEAM_CUSTOMIZATION = 'SET_COMPLETED_TEAM_CUSTOMIZATION';
export const SET_COMPLETED_CUSTOMIZATION = 'SET_COMPLETED_CUSTOMIZATION';
export const SET_COMPLETED_INVITE_TEAMMATES = 'SET_COMPLETED_INVITE_TEAMMATES';

export function finalizeOnboarding() {
  return createAction(FINALIZE_ONBOARDING);
}

export function setCompletedProfile(payload) {
  return createAction(SET_COMPLETED_PROFILE, payload);
}

export function setCompletedTeamCustomization(payload) {
  return createAction(SET_COMPLETED_TEAM_CUSTOMIZATION, payload);
}

export function setCompletedCustomization(payload) {
  return createAction(SET_COMPLETED_CUSTOMIZATION, payload);
}

export function setCompletedInviteTeammates(payload) {
  return createAction(SET_COMPLETED_INVITE_TEAMMATES, payload);
}
