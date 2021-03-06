import {
  INITIALIZE_USER_PENDING,
  INITIALIZE_USER_SUCCESS,
  INITIALIZE_USER_ERROR,
  INITIALIZE_USER_POLLING_START,
  INITIALIZE_USER_POLLING_STOP,
} from './actions';

const initialState = {
  polling: false,
  pending: false,
  error: null,
  available: null,
};

export default function initialize(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_USER_PENDING:
      return {
        ...state,
        pending: true,
        error: null,
      };

    case INITIALIZE_USER_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
      };

    case INITIALIZE_USER_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case INITIALIZE_USER_POLLING_START:
      return {
        ...state,
        polling: true,
      };

    case INITIALIZE_USER_POLLING_STOP:
      return {
        ...state,
        polling: false,
      };

    default:
      return state;
  }
}
