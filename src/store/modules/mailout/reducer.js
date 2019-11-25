import {
  GET_MAILOUT_DETAILS_PENDING,
  GET_MAILOUT_DETAILS_SUCCESS,
  GET_MAILOUT_DETAILS_ERROR,
  NEEDS_UPDATE_MAILOUT_DETAILS_PENDING,
  NEEDS_UPDATE_MAILOUT_DETAILS_SUCCESS,
  NEEDS_UPDATE_MAILOUT_DETAILS_ERROR,
  APPROVE_AND_SEND_MAILOUT_DETAILS_PENDING,
  APPROVE_AND_SEND_MAILOUT_DETAILS_SUCCESS,
  APPROVE_AND_SEND_MAILOUT_DETAILS_ERROR,
  DELETE_MAILOUT_DETAILS_PENDING,
  DELETE_MAILOUT_DETAILS_SUCCESS,
  DELETE_MAILOUT_DETAILS_ERROR,
  RESET_MAILOUT_DETAILS,
} from './actions';

const initialState = {
  pending: false,
  mailoutId: null,
  details: null,
  error: null,
};

export default function mailouts(state = initialState, action) {
  switch (action.type) {
    case GET_MAILOUT_DETAILS_PENDING:
      return {
        ...state,
        pending: true,
        mailoutId: action.payload,
      };

    case GET_MAILOUT_DETAILS_SUCCESS:
      return {
        ...state,
        pending: false,
        details: action.payload,
      };

    case NEEDS_UPDATE_MAILOUT_DETAILS_PENDING:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case NEEDS_UPDATE_MAILOUT_DETAILS_SUCCESS:
      return {
        ...state,
        pending: true,
        mailoutId: action.payload,
      };

    case NEEDS_UPDATE_MAILOUT_DETAILS_ERROR:
      return {
        ...state,
        pending: false,
        details: action.payload,
      };

    case GET_MAILOUT_DETAILS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case APPROVE_AND_SEND_MAILOUT_DETAILS_PENDING:
      return {
        ...state,
        pending: true,
        mailoutId: action.payload,
      };

    case APPROVE_AND_SEND_MAILOUT_DETAILS_SUCCESS:
      return {
        ...state,
        pending: false,
        details: action.payload,
      };

    case APPROVE_AND_SEND_MAILOUT_DETAILS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case DELETE_MAILOUT_DETAILS_PENDING:
      return {
        ...state,
        pending: true,
        mailoutId: action.payload,
      };

    case DELETE_MAILOUT_DETAILS_SUCCESS:
      return {
        ...state,
        pending: false,
        details: action.payload,
      };

    case DELETE_MAILOUT_DETAILS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case RESET_MAILOUT_DETAILS:
      return {
        ...state,
        mailoutId: null,
        details: null,
        error: null,
      };

    default:
      return state;
  }
}
