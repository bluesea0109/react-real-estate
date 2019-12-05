import { SAVE_TEAM_PROFILE_PENDING, SAVE_TEAM_PROFILE_SUCCESS, SAVE_TEAM_PROFILE_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  available: null,
  toSave: null,
};

export default function teamProfile(state = initialState, action) {
  switch (action.type) {
    case SAVE_TEAM_PROFILE_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
        toSave: action.payload,
      };

    case SAVE_TEAM_PROFILE_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
        toSave: null,
      };

    case SAVE_TEAM_PROFILE_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
