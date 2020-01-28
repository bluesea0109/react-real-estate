import {
  SAVE_TEAM_LISTED_SHORTCODE_PENDING,
  SAVE_TEAM_LISTED_SHORTCODE_SUCCESS,
  SAVE_TEAM_LISTED_SHORTCODE_ERROR,
  SAVE_TEAM_SOLD_SHORTCODE_PENDING,
  SAVE_TEAM_SOLD_SHORTCODE_SUCCESS,
  SAVE_TEAM_SOLD_SHORTCODE_ERROR,
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

export default function teamShortcode(state = initialState, action) {
  switch (action.type) {
    case SAVE_TEAM_LISTED_SHORTCODE_PENDING:
      return {
        ...state,
        listedURLToShortenError: null,
        listedURLToShortenPending: true,
        listedURLToShorten: action.payload,
      };

    case SAVE_TEAM_LISTED_SHORTCODE_SUCCESS:
      return {
        ...state,
        listedURLToShortenPending: false,
        listed: action.payload,
      };

    case SAVE_TEAM_LISTED_SHORTCODE_ERROR:
      return {
        ...state,
        listedURLToShortenPending: false,
        listedURLToShortenError: action.error,
      };

    case SAVE_TEAM_SOLD_SHORTCODE_PENDING:
      return {
        ...state,
        soldURLToShortenError: null,
        soldURLToShortenPending: true,
        soldURLToShorten: action.payload,
      };

    case SAVE_TEAM_SOLD_SHORTCODE_SUCCESS:
      return {
        ...state,
        soldURLToShortenPending: false,
        sold: action.payload,
      };

    case SAVE_TEAM_SOLD_SHORTCODE_ERROR:
      return {
        ...state,
        soldURLToShortenPending: false,
        soldURLToShortenError: action.error,
      };

    default:
      return state;
  }
}
