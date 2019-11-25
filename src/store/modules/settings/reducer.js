import {
  GET_USER_SETTINGS_PENDING,
  GET_USER_SETTINGS_BRANDING_SUCCESS,
  GET_USER_SETTINGS_BRANDING_ERROR,
  GET_USER_SETTINGS_PHOTO_SUCCESS,
  GET_USER_SETTINGS_PHOTO_ERROR,
  GET_USER_SETTINGS_PROFILE_SUCCESS,
  GET_USER_SETTINGS_PROFILE_ERROR,
  GET_PEER_SETTINGS_PENDING,
  GET_PEER_SETTINGS_BRANDING_SUCCESS,
  GET_PEER_SETTINGS_BRANDING_ERROR,
  GET_PEER_SETTINGS_PHOTO_SUCCESS,
  GET_PEER_SETTINGS_PHOTO_ERROR,
  GET_PEER_SETTINGS_PROFILE_SUCCESS,
  GET_PEER_SETTINGS_PROFILE_ERROR,
} from './actions';

const initialState = {
  pending: false,
  error: [],
  branding: null,
  photos: null,
  profile: null,
};

const formatError = (action, error) => ({ action, error });

export default function settings(state = initialState, action) {
  switch (action.type) {
    case GET_USER_SETTINGS_PENDING:
      return {
        ...state,
        pending: true,
        error: [],
        branding: null,
        photos: null,
        profile: null,
      };

    case GET_USER_SETTINGS_BRANDING_SUCCESS:
      return {
        ...state,
        pending: false,
        branding: action.payload,
      };

    case GET_USER_SETTINGS_BRANDING_ERROR:
      state.error.push(formatError(action.type, action.error));

      return {
        ...state,
        pending: false,
        branding: null,
      };

    case GET_USER_SETTINGS_PHOTO_SUCCESS:
      return {
        ...state,
        pending: false,
        photos: action.payload,
      };

    case GET_USER_SETTINGS_PHOTO_ERROR:
      state.error.push(formatError(action.type, action.error));

      return {
        ...state,
        pending: false,
        photos: null,
      };

    case GET_USER_SETTINGS_PROFILE_SUCCESS:
      return {
        ...state,
        pending: false,
        profile: action.payload,
      };

    case GET_USER_SETTINGS_PROFILE_ERROR:
      state.error.push(formatError(action.type, action.error));

      return {
        ...state,
        pending: false,
        profile: null,
      };

    case GET_PEER_SETTINGS_PENDING:
      return {
        ...state,
        error: [],
        pending: true,
        branding: null,
        photos: null,
        profile: null,
      };

    case GET_PEER_SETTINGS_BRANDING_SUCCESS:
      return {
        ...state,
        pending: false,
        branding: action.payload,
      };

    case GET_PEER_SETTINGS_BRANDING_ERROR:
      state.error.push(formatError(action.type, action.error));

      return {
        ...state,
        pending: false,
        branding: null,
      };

    case GET_PEER_SETTINGS_PHOTO_SUCCESS:
      return {
        ...state,
        pending: false,
        photos: action.payload,
      };

    case GET_PEER_SETTINGS_PHOTO_ERROR:
      state.error.push(formatError(action.type, action.error));

      return {
        ...state,
        pending: false,
        photos: null,
      };

    case GET_PEER_SETTINGS_PROFILE_SUCCESS:
      return {
        ...state,
        pending: false,
        profile: action.payload,
      };

    case GET_PEER_SETTINGS_PROFILE_ERROR:
      state.error.push(formatError(action.type, action.error));

      return {
        ...state,
        pending: false,
        profile: null,
      };

    default:
      return state;
  }
}
