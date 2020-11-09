import { createAction } from '../../utils/helpers';

export const FINALIZE_ONBOARDING = 'FINALIZE_ONBOARDING';
export const SET_COMPLETED_PROFILE = 'SET_COMPLETED_PROFILE';
export const SET_COMPLETED_TEAM_CUSTOMIZATION = 'SET_COMPLETED_TEAM_CUSTOMIZATION';
export const SET_COMPLETED_CUSTOMIZATION = 'SET_COMPLETED_CUSTOMIZATION';
export const SET_COMPLETED_INVITE_TEAMMATES = 'SET_COMPLETED_INVITE_TEAMMATES';
export const SET_COMPLETED_DASHBOARD_MODAL = 'SET_COMPLETED_DASHBOARD_MODAL';

export function finalizeOnboarding() {
  return createAction(FINALIZE_ONBOARDING);
}

export function setCompletedProfile() {
  return createAction(SET_COMPLETED_PROFILE);
}

export function setCompletedTeamCustomization() {
  return createAction(SET_COMPLETED_TEAM_CUSTOMIZATION);
}

export function setCompletedCustomization() {
  return createAction(SET_COMPLETED_CUSTOMIZATION);
}

export function setCompletedInviteTeammates() {
  return createAction(SET_COMPLETED_INVITE_TEAMMATES);
}

export function setCompletedDashboardModal() {
  return createAction(SET_COMPLETED_DASHBOARD_MODAL);
}
