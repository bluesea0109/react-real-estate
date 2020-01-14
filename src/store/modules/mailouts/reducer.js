import {
  GET_MAILOUTS_PENDING,
  GET_MAILOUTS_SUCCESS,
  GET_MAILOUTS_ERROR,
  TOGGLE_CAN_GET_MORE,
  GET_MORE_MAILOUTS_PENDING,
  GET_MORE_MAILOUTS_SUCCESS,
  GET_MORE_MAILOUTS_ERROR,
  RESET_MAILOUTS,
  GENERATE_MAILOUTS_PENDING,
  GENERATE_MAILOUTS_SUCCESS,
  GENERATE_MAILOUTS_ERROR,
} from './actions';

const initialState = {
  pending: false,
  generatePending: false,
  canLoadMore: false,
  page: 1,
  list: [],
  error: null,
  generateError: false,
};

export default function mailouts(state = initialState, action) {
  switch (action.type) {
    case GET_MAILOUTS_PENDING:
      return {
        ...state,
        pending: true,
      };

    case GET_MAILOUTS_SUCCESS:
      const getMailoutsSuccessNewList = state.list.concat(action.payload);

      return {
        ...state,
        pending: false,
        list: getMailoutsSuccessNewList,
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
      const getMoreMailoutsNewList = state.list.concat(action.payload);

      return {
        ...state,
        pending: false,
        list: getMoreMailoutsNewList,
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
        canLoadMore: false,
        page: 1,
        list: [],
        error: null,
      };

    case GENERATE_MAILOUTS_PENDING:
      return {
        ...state,
        generatePending: true,
      };

    case GENERATE_MAILOUTS_SUCCESS:
      const generateMailoutsSuccessNewList = state.list.concat(action.payload);

      return {
        ...state,
        generatePending: false,
        list: generateMailoutsSuccessNewList,
      };

    case GENERATE_MAILOUTS_ERROR:
      return {
        ...state,
        generatePending: false,
        generateError: action.error,
      };

    default:
      return state;
  }
}
