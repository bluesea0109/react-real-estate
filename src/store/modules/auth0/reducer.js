import {
  AUTHENTICATION_PENDING,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_ERROR,
  COOKIE_AUTHENTICATION,
  PASSWORD_RESET_PENDING,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_ERROR,
} from './actions';

const initialState = {
  pending: false,
  passwordResetPending: false,
  authenticated: false,
  details: null,
  passwordResetDetails: null,
  error: null,
  passwordResetError: null,
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

    case PASSWORD_RESET_PENDING:
      return {
        ...state,
        passwordResetPending: true,
        passwordResetDetails: null,
        passwordResetError: null,
      };

    case PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        passwordResetPending: false,
        passwordResetDetails: action.payload,
      };

    case PASSWORD_RESET_ERROR:
      return {
        ...state,
        passwordResetPending: false,
        passwordResetError: action.error,
      };

    default:
      return state;
  }
}
