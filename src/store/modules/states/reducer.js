import { GET_STATES_PENDING, GET_STATES_SUCCESS, GET_STATES_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  states: null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case GET_STATES_PENDING:
      return {
        ...state,
        pending: true,
      };

    case GET_STATES_SUCCESS:
      return {
        ...state,
        pending: false,
        states: action.payload,
      };

    case GET_STATES_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
