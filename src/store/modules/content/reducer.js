import {
  GET_READY_MADE_CONTENT_PENDING,
  GET_READY_MADE_CONTENT_SUCCESS,
  GET_READY_MADE_CONTENT_ERROR,
} from './actions';

const initialState = {
  pending: false,
  list: [],
  error: null,
};

export default function content(state = initialState, action) {
  switch (action.type) {
    case GET_READY_MADE_CONTENT_PENDING:
      return {
        ...state,
        pending: true,
      };

    case GET_READY_MADE_CONTENT_SUCCESS:
      return {
        ...state,
        pending: false,
        list: action.payload.results,
      };

    case GET_READY_MADE_CONTENT_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
