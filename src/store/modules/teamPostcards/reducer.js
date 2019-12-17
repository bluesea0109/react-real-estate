import { GENERATE_TEAM_POSTCARDS_PREVIEW_PENDING, GENERATE_TEAM_POSTCARDS_PREVIEW_SUCCESS, GENERATE_TEAM_POSTCARDS_PREVIEW_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  available: null,
};

export default function teamPostcards(state = initialState, action) {
  switch (action.type) {
    case GENERATE_TEAM_POSTCARDS_PREVIEW_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
      };

    case GENERATE_TEAM_POSTCARDS_PREVIEW_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
      };

    case GENERATE_TEAM_POSTCARDS_PREVIEW_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
