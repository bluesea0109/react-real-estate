import {
  FINALIZE_ONBOARDING,
  SET_COMPLETED_PROFILE,
  SET_COMPLETED_TEAM_CUSTOMIZATION,
  SET_COMPLETED_CUSTOMIZATION,
  SET_COMPLETED_INVITE_TEAMMATES,
} from './actions';

const initialState = {
  status: false,
  completedProfile: false,
  completedTeamCustomization: false,
  completedCustomization: false,
  completedInviteTeammates: false,
};

export default function onboarded(state = initialState, action) {
  switch (action.type) {
    case FINALIZE_ONBOARDING:
      return {
        ...state,
        status: true,
        completedProfile: true,
        completedTeamCustomization: true,
        completedCustomization: true,
        completedInviteTeammates: true,
      };

    case SET_COMPLETED_PROFILE:
      return {
        ...state,
        completedProfile: true,
      };

    case SET_COMPLETED_TEAM_CUSTOMIZATION:
      return {
        ...state,
        completedTeamCustomization: true,
      };

    case SET_COMPLETED_CUSTOMIZATION:
      return {
        ...state,
        completedCustomization: true,
      };

    case SET_COMPLETED_INVITE_TEAMMATES:
      return {
        ...state,
        completedInviteTeammates: true,
      };

    default:
      return state;
  }
}
