import {
  GET_MAILOUT_PENDING,
  GET_MAILOUT_SUCCESS,
  GET_MAILOUT_ERROR,
  SUBMIT_MAILOUT_PENDING,
  SUBMIT_MAILOUT_SUCCESS,
  SUBMIT_MAILOUT_ERROR,
  STOP_MAILOUT_PENDING,
  STOP_MAILOUT_SUCCESS,
  STOP_MAILOUT_ERROR,
  RESET_MAILOUT,
  UPDATE_MAILOUT_SIZE_PENDING,
  UPDATE_MAILOUT_SIZE_SUCCESS,
  UPDATE_MAILOUT_SIZE_ERROR,
} from './actions';

const initialState = {
  pending: false,
  mailoutId: null,
  mailoutSize: null,
  details: null,
  error: null,
};

export default function mailout(state = initialState, action) {
  switch (action.type) {
    case GET_MAILOUT_PENDING:
      return {
        ...state,
        pending: true,
        mailoutId: action.payload,
        error: null,
      };

    case GET_MAILOUT_SUCCESS:
      return {
        ...state,
        pending: false,
        details: action.payload,
        error: null,
      };

    case GET_MAILOUT_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case SUBMIT_MAILOUT_PENDING:
      return {
        ...state,
        pending: true,
        mailoutId: action.payload,
        error: null,
      };

    case SUBMIT_MAILOUT_SUCCESS:
      return {
        ...state,
        pending: false,
        details: action.payload,
        error: null,
      };

    case SUBMIT_MAILOUT_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case STOP_MAILOUT_PENDING:
      return {
        ...state,
        pending: true,
        mailoutId: action.payload,
        error: null,
      };

    case STOP_MAILOUT_SUCCESS:
      return {
        ...state,
        pending: false,
        details: action.payload,
        error: null,
      };

    case STOP_MAILOUT_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case RESET_MAILOUT:
      return {
        ...state,
        mailoutId: null,
        details: null,
        error: null,
      };

    case UPDATE_MAILOUT_SIZE_PENDING:
      return {
        ...state,
        pending: false,
        mailoutSize: action.payload,
        error: null,
      };

    case UPDATE_MAILOUT_SIZE_SUCCESS:
      return {
        ...state,
        pending: true,
        mailoutSize: null,
        error: null,
      };

    case UPDATE_MAILOUT_SIZE_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
