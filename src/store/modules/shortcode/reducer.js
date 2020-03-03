import {
  SAVE_LISTED_SHORTCODE_PENDING,
  SAVE_LISTED_SHORTCODE_SUCCESS,
  SAVE_LISTED_SHORTCODE_ERROR,
  SAVE_SOLD_SHORTCODE_PENDING,
  SAVE_SOLD_SHORTCODE_SUCCESS,
  SAVE_SOLD_SHORTCODE_ERROR,
} from './actions';

const initialState = {
  listedURLToShortenPending: false,
  listed: null,
  listedURLToShorten: null,
  listedURLToShortenError: null,

  soldURLToShortenPending: false,
  sold: null,
  soldURLToShorten: null,
  soldURLToShortenError: null,
};

export default function shortcode(state = initialState, action) {
  switch (action.type) {
    case SAVE_LISTED_SHORTCODE_PENDING:
      return {
        ...state,
        listed: null,
        listedURLToShortenError: null,
        listedURLToShortenPending: true,
        listedURLToShorten: action.payload,
      };

    case SAVE_LISTED_SHORTCODE_SUCCESS:
      return {
        ...state,
        listedURLToShortenPending: false,
        listed: action.payload,
      };

    case SAVE_LISTED_SHORTCODE_ERROR:
      return {
        ...state,
        listedURLToShortenPending: false,
        listedURLToShortenError: action.error,
      };

    case SAVE_SOLD_SHORTCODE_PENDING:
      return {
        ...state,
        sold: null,
        soldURLToShortenError: null,
        soldURLToShortenPending: true,
        soldURLToShorten: action.payload,
      };

    case SAVE_SOLD_SHORTCODE_SUCCESS:
      return {
        ...state,
        soldURLToShortenPending: false,
        sold: action.payload,
      };

    case SAVE_SOLD_SHORTCODE_ERROR:
      return {
        ...state,
        soldURLToShortenPending: false,
        soldURLToShortenError: action.error,
      };

    default:
      return state;
  }
}
