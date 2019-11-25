import { GET_TEAM_PENDING, GET_TEAM_SUCCESS, GET_TEAM_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  profiles: [],
};

export default function team(state = initialState, action) {
  switch (action.type) {
    case GET_TEAM_PENDING:
      return {
        ...state,
        pending: true,
      };

    case GET_TEAM_SUCCESS:
      return {
        ...state,
        pending: false,
        profiles: action.payload,
      };

    case GET_TEAM_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
