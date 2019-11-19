import {
  FETCH_MAILOUT_PENDING,
  FETCH_MAILOUT_SUCCESS,
  FETCH_MAILOUT_ERROR,
  TOGGLE_CAN_FETCH_MORE,
  FETCH_MORE_MAILOUTS_PENDING,
  FETCH_MORE_MAILOUTS_SUCCESS,
  FETCH_MORE_MAILOUTS_ERROR,
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
    case FETCH_MAILOUT_PENDING:
      return {
        ...state,
        pending: true,
      };

    case FETCH_MAILOUT_SUCCESS:
      return {
        ...state,
        pending: false,
        list: action.payload,
      };

    case FETCH_MAILOUT_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case TOGGLE_CAN_FETCH_MORE:
      return {
        ...state,
        canLoadMore: action.payload,
      };

    case FETCH_MORE_MAILOUTS_PENDING:
      return {
        ...state,
        pending: true,
        page: action.payload,
      };

    case FETCH_MORE_MAILOUTS_SUCCESS:
      const newList = state.list.concat(action.payload);
      return {
        ...state,
        pending: false,
        list: newList,
      };

    case FETCH_MORE_MAILOUTS_ERROR:
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
