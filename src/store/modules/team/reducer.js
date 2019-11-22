import { FETCH_TEAM_PENDING, FETCH_TEAM_SUCCESS, FETCH_TEAM_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  profiles: [],
};

export default function team(state = initialState, action) {
  switch (action.type) {
    case FETCH_TEAM_PENDING:
      return {
        ...state,
        pending: true,
      };

    case FETCH_TEAM_SUCCESS:
      return {
        ...state,
        pending: false,
        profiles: action.payload,
      };

    case FETCH_TEAM_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
