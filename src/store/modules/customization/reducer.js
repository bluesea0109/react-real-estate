import {
  GET_CUSTOMIZATION_PENDING,
  GET_CUSTOMIZATION_SUCCESS,
  GET_CUSTOMIZATION_ERROR,
  SAVE_CUSTOMIZATION_PENDING,
  SAVE_CUSTOMIZATION_SUCCESS,
  SAVE_CUSTOMIZATION_ERROR,
  REVIEW_CUSTOMIZATION_COMPLETED,
} from './actions';

const initialState = {
  pending: false,
  error: null,
  available: null,
  toSave: null,
  reviewed: false,
};

export default function customization(state = initialState, action) {
  switch (action.type) {
    case GET_CUSTOMIZATION_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
      };

    case GET_CUSTOMIZATION_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
        error: null,
      };

    case GET_CUSTOMIZATION_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
        available: null,
      };

    case SAVE_CUSTOMIZATION_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
        toSave: action.payload,
      };

    case SAVE_CUSTOMIZATION_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
        toSave: null,
        error: null,
      };

    case SAVE_CUSTOMIZATION_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
        available: null,
      };

    case REVIEW_CUSTOMIZATION_COMPLETED:
      return {
        ...state,
        reviewed: true,
      };

    default:
      return state;
  }
}
