import { FETCH_MAILOUT_PENDING, FETCH_MAILOUT_SUCCESS, FETCH_MAILOUT_ERROR, CHANGE_FETCH_MAILOUT_LIMIT, CHANGE_FETCH_MAILOUT_PAGE } from './actions';

const initialState = {
  pending: false,
  page: 1,
  limit: 5,
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

    case CHANGE_FETCH_MAILOUT_LIMIT:
      return {
        ...state,
        limit: action.payload,
      };

    case CHANGE_FETCH_MAILOUT_PAGE:
      return {
        ...state,
        page: action.payload,
      };

    default:
      return state;
  }
}
