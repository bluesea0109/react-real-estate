import {
  INITIALIZE_TEAM_PENDING,
  INITIALIZE_TEAM_SUCCESS,
  INITIALIZE_TEAM_ERROR,
  INITIALIZE_TEAM_POLLING_START,
  INITIALIZE_TEAM_POLLING_STOP,
} from './actions';

const initialState = {
  polling: false,
  pending: false,
  error: null,
  available: null,
};

export default function inviteUsers(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_TEAM_PENDING:
      return {
        ...state,
        pending: true,
        error: null,
      };

    case INITIALIZE_TEAM_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
      };

    case INITIALIZE_TEAM_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case INITIALIZE_TEAM_POLLING_START:
      return {
        ...state,
        polling: true,
      };

    case INITIALIZE_TEAM_POLLING_STOP:
      return {
        ...state,
        polling: false,
      };

    default:
      return state;
  }
}
