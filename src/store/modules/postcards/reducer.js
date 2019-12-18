import { GENERATE_POSTCARDS_PREVIEW_PENDING, GENERATE_POSTCARDS_PREVIEW_SUCCESS, GENERATE_POSTCARDS_PREVIEW_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  available: null,
};

export default function postcards(state = initialState, action) {
  switch (action.type) {
    case GENERATE_POSTCARDS_PREVIEW_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
        available: null,
      };

    case GENERATE_POSTCARDS_PREVIEW_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
      };

    case GENERATE_POSTCARDS_PREVIEW_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
        available: null,
      };

    default:
      return state;
  }
}
