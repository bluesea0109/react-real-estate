import { FETCH_MAILOUT_DETAILS_PENDING, FETCH_MAILOUT_DETAILS_SUCCESS, FETCH_MAILOUT_DETAILS_ERROR } from './actions';

const initialState = {
  pending: false,
  mailoutId: null,
  details: null,
  error: null,
};

export default function mailouts(state = initialState, action) {
  switch (action.type) {
    case FETCH_MAILOUT_DETAILS_PENDING:
      return {
        ...state,
        pending: true,
        mailoutId: action.payload,
      };

    case FETCH_MAILOUT_DETAILS_SUCCESS:
      return {
        ...state,
        pending: false,
        details: action.payload,
      };

    case FETCH_MAILOUT_DETAILS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
