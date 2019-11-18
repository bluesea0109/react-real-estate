import { FETCH_MAILOUT_PENDING, FETCH_MAILOUT_SUCCESS, FETCH_MAILOUT_ERROR } from './actions';

const initialState = {
  pending: false,
  list: [],
  error: null,
};

export default function mailouts(state = initialState, action) {
  switch (action.type) {
    case FETCH_MAILOUT_PENDING:
      return {
        ...state,
        pending: true,
      };

    case FETCH_MAILOUT_SUCCESS:
      return {
        ...state,
        pending: false,
        list: action.payload,
      };

    case FETCH_MAILOUT_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
