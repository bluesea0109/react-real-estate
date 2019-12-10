import {
  GET_TEAM_CUSTOMIZATION_PENDING,
  GET_TEAM_CUSTOMIZATION_SUCCESS,
  GET_TEAM_CUSTOMIZATION_ERROR,
  SAVE_TEAM_CUSTOMIZATION_PENDING,
  SAVE_TEAM_CUSTOMIZATION_SUCCESS,
  SAVE_TEAM_CUSTOMIZATION_ERROR,
} from './actions';

const initialState = {
  pending: false,
  error: null,
  available: null,
  toSave: null,
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
      };

    case SAVE_TEAM_CUSTOMIZATION_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
