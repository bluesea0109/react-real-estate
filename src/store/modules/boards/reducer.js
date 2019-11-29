import { GET_BOARDS_PENDING, GET_BOARDS_SUCCESS, GET_BOARDS_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  boards: null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case GET_BOARDS_PENDING:
      return {
        ...state,
        pending: true,
      };

    case GET_BOARDS_SUCCESS:
      return {
        ...state,
        pending: false,
        boards: action.payload,
      };

    case GET_BOARDS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
