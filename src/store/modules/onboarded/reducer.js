import {
  FINALIZE_ONBOARDING,
  SET_COMPLETED_PROFILE,
  SET_COMPLETED_TEAM_CUSTOMIZATION,
  SET_COMPLETED_CUSTOMIZATION,
  SET_COMPLETED_INVITE_TEAMMATES,
} from './actions';

const initialState = {
  status: false,
  completedProfile: null,
  completedTeamCustomization: null,
  completedCustomization: null,
  completedInviteTeammates: null,
};

export default function onboarded(state = initialState, action) {
  switch (action.type) {
    case FINALIZE_ONBOARDING:
      return {
        ...state,
        status: true,
      };

    case SET_COMPLETED_PROFILE:
      return {
        ...state,
        completedProfile: action.payload,
      };

    case SET_COMPLETED_TEAM_CUSTOMIZATION:
      return {
        ...state,
        completedTeamCustomization: action.payload,
      };

    case SET_COMPLETED_CUSTOMIZATION:
      return {
        ...state,
        completedCustomization: action.payload,
      };

    case SET_COMPLETED_INVITE_TEAMMATES:
      return {
        ...state,
        completedInviteTeammates: action.payload,
      };

    default:
      return state;
  }
}
