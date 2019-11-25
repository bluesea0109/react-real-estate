import {
  GET_MAILOUTS_PENDING,
  GET_MAILOUTS_SUCCESS,
  GET_MAILOUTS_ERROR,
  TOGGLE_CAN_GET_MORE,
  GET_MORE_MAILOUTS_PENDING,
  GET_MORE_MAILOUTS_SUCCESS,
  GET_MORE_MAILOUTS_ERROR,
  RESET_MAILOUTS,
} from './actions';

const initialState = {
  pending: false,
  canLoadMore: false,
  page: 1,
  list: [],
  error: null,
};

export default function mailouts(state = initialState, action) {
  switch (action.type) {
    case GET_MAILOUTS_PENDING:
      return {
        ...state,
        pending: true,
      };

    case GET_MAILOUTS_SUCCESS:
      return {
        ...state,
        pending: false,
        list: action.payload,
      };

    case GET_MAILOUTS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case TOGGLE_CAN_GET_MORE:
      return {
        ...state,
        canLoadMore: action.payload,
      };

    case GET_MORE_MAILOUTS_PENDING:
      return {
        ...state,
        pending: true,
        page: action.payload,
      };

    case GET_MORE_MAILOUTS_SUCCESS:
      const newList = state.list.concat(action.payload);
      return {
        ...state,
        pending: false,
        list: newList,
      };

    case GET_MORE_MAILOUTS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case RESET_MAILOUTS:
      return {
        ...state,
        canLoadMore: true,
        page: 1,
        list: [],
        error: null,
      };

    default:
      return state;
  }
}
