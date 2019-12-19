import { AUTHENTICATION_PENDING, AUTHENTICATION_SUCCESS, AUTHENTICATION_ERROR, COOKIE_AUTHENTICATION } from './actions';

const initialState = {
  pending: false,
  authenticated: false,
  details: null,
  error: null,
};

export default function auth0(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATION_PENDING:
      return {
        ...state,
        pending: true,
      };

    case AUTHENTICATION_SUCCESS:
      return {
        ...state,
        pending: false,
        authenticated: true,
        details: action.payload,
      };

    case AUTHENTICATION_ERROR:
      return {
        ...state,
        pending: false,
        authenticated: false,
        error: action.error,
      };

    case COOKIE_AUTHENTICATION:
      return {
        ...state,
        pending: false,
        authenticated: true,
        details: action.payload,
      };

    default:
      return state;
  }
}
