import {
  GET_SOLD_SHORTCODE_PENDING,
  GET_SOLD_SHORTCODE_SUCCESS,
  GET_SOLD_SHORTCODE_ERROR,
  SAVE_SOLD_SHORTCODE_PENDING,
  SAVE_SOLD_SHORTCODE_SUCCESS,
  SAVE_SOLD_SHORTCODE_ERROR,
  GET_LISTED_SHORTCODE_PENDING,
  GET_LISTED_SHORTCODE_SUCCESS,
  GET_LISTED_SHORTCODE_ERROR,
  SAVE_LISTED_SHORTCODE_PENDING,
  SAVE_LISTED_SHORTCODE_SUCCESS,
  SAVE_LISTED_SHORTCODE_ERROR,
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
    case GET_SOLD_SHORTCODE_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
      };

    case GET_SOLD_SHORTCODE_SUCCESS:
      return {
        ...state,
        pending: false,
        sold: action.payload,
      };

    case GET_SOLD_SHORTCODE_ERROR:
      return {
        ...state,
        pending: false,
        error: Object.assign({}, state.error, { onGetSold: action.error }),
      };

    case SAVE_SOLD_SHORTCODE_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
        soldToSave: action.payload,
      };

    case SAVE_SOLD_SHORTCODE_SUCCESS:
      return {
        ...state,
        pending: false,
        sold: action.payload,
      };

    case SAVE_SOLD_SHORTCODE_ERROR:
      return {
        ...state,
        pending: false,
        soldToSave: null,
        error: Object.assign({}, state.error, { onSaveSold: action.error }),
      };

    case GET_LISTED_SHORTCODE_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
      };

    case GET_LISTED_SHORTCODE_SUCCESS:
      return {
        ...state,
        pending: false,
        listed: action.payload,
      };

    case GET_LISTED_SHORTCODE_ERROR:
      return {
        ...state,
        pending: false,
        error: Object.assign({}, state.error, { onGetListed: action.error }),
      };

    case SAVE_LISTED_SHORTCODE_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
        listedToSave: action.payload,
      };

    case SAVE_LISTED_SHORTCODE_SUCCESS:
      return {
        ...state,
        pending: false,
        listed: action.payload,
      };

    case SAVE_LISTED_SHORTCODE_ERROR:
      return {
        ...state,
        pending: false,
        listedToSave: null,
        error: Object.assign({}, state.error, { onSaveListed: action.error }),
      };

    default:
      return state;
  }
}
