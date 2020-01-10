import {
  GET_TEAM_PROFILE_PENDING,
  GET_TEAM_PROFILE_SUCCESS,
  GET_TEAM_PROFILE_ERROR,
  SAVE_TEAM_PROFILE_PENDING,
  SAVE_TEAM_PROFILE_SUCCESS,
  SAVE_TEAM_PROFILE_ERROR,
} from './actions';

const initialState = {
  pending: false,
  savePending: false,
  saveError: null,
  error: null,
  available: null,
  toSave: null,
};

export default function teamProfile(state = initialState, action) {
  switch (action.type) {
    case GET_TEAM_PROFILE_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
      };

    case GET_TEAM_PROFILE_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
      };

    case GET_TEAM_PROFILE_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case SAVE_TEAM_PROFILE_PENDING:
      return {
        ...state,
        saveError: null,
        savePending: true,
        toSave: action.payload,
      };

    case SAVE_TEAM_PROFILE_SUCCESS:
      return {
        ...state,
        savePending: false,
        available: action.payload,
        toSave: null,
      };

    case SAVE_TEAM_PROFILE_ERROR:
      return {
        ...state,
        savePending: false,
        saveError: action.error,
      };

    default:
      return state;
  }
}
