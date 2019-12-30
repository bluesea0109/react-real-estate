import {
  GET_TEAM_CUSTOMIZATION_PENDING,
  GET_TEAM_CUSTOMIZATION_SUCCESS,
  GET_TEAM_CUSTOMIZATION_ERROR,
  SAVE_TEAM_CUSTOMIZATION_PENDING,
  SAVE_TEAM_CUSTOMIZATION_SUCCESS,
  SAVE_TEAM_CUSTOMIZATION_ERROR,
  REVIEW_TEAM_CUSTOMIZATION_COMPLETED,
} from './actions';

const initialState = {
  pending: false,
  error: null,
  available: null,
  toSave: null,
  reviewed: false,
};

export default function teamCustomization(state = initialState, action) {
  switch (action.type) {
    case GET_TEAM_CUSTOMIZATION_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
      };

    case GET_TEAM_CUSTOMIZATION_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
        error: null,
      };

    case GET_TEAM_CUSTOMIZATION_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case SAVE_TEAM_CUSTOMIZATION_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
        toSave: action.payload,
      };

    case SAVE_TEAM_CUSTOMIZATION_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
        toSave: null,
        error: null,
      };

    case SAVE_TEAM_CUSTOMIZATION_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case REVIEW_TEAM_CUSTOMIZATION_COMPLETED:
      return {
        ...state,
        reviewed: true,
      };

    default:
      return state;
  }
}
