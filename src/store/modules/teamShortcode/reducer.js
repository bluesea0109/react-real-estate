import {
  GET_TEAM_SOLD_SHORTCODE_PENDING,
  GET_TEAM_SOLD_SHORTCODE_SUCCESS,
  GET_TEAM_SOLD_SHORTCODE_ERROR,
  SAVE_TEAM_SOLD_SHORTCODE_PENDING,
  SAVE_TEAM_SOLD_SHORTCODE_SUCCESS,
  SAVE_TEAM_SOLD_SHORTCODE_ERROR,
  GET_TEAM_LISTED_SHORTCODE_PENDING,
  GET_TEAM_LISTED_SHORTCODE_SUCCESS,
  GET_TEAM_LISTED_SHORTCODE_ERROR,
  SAVE_TEAM_LISTED_SHORTCODE_PENDING,
  SAVE_TEAM_LISTED_SHORTCODE_SUCCESS,
  SAVE_TEAM_LISTED_SHORTCODE_ERROR,
} from './actions';

const initialState = {
  pending: false,
  error: null,
  sold: null,
  listed: null,
  soldToSave: null,
  listedToSave: null,
};

export default function teamShortcode(state = initialState, action) {
  switch (action.type) {
    case GET_TEAM_SOLD_SHORTCODE_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
      };

    case GET_TEAM_SOLD_SHORTCODE_SUCCESS:
      return {
        ...state,
        pending: false,
        sold: action.payload,
      };

    case GET_TEAM_SOLD_SHORTCODE_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case SAVE_TEAM_SOLD_SHORTCODE_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
        soldToSave: action.payload,
      };

    case SAVE_TEAM_SOLD_SHORTCODE_SUCCESS:
      return {
        ...state,
        pending: false,
        sold: action.payload,
        soldToSave: null,
      };

    case SAVE_TEAM_SOLD_SHORTCODE_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case GET_TEAM_LISTED_SHORTCODE_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
      };

    case GET_TEAM_LISTED_SHORTCODE_SUCCESS:
      return {
        ...state,
        pending: false,
        listed: action.payload,
      };

    case GET_TEAM_LISTED_SHORTCODE_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case SAVE_TEAM_LISTED_SHORTCODE_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
        listedToSave: action.payload,
      };

    case SAVE_TEAM_LISTED_SHORTCODE_SUCCESS:
      return {
        ...state,
        pending: false,
        listed: action.payload,
        listedToSave: null,
      };

    case SAVE_TEAM_LISTED_SHORTCODE_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
