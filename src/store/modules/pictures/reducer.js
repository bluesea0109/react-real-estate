import {
  GET_ALL_PHOTOS_PENDING,
  GET_ALL_PHOTOS_SUCCESS,
  GET_ALL_PHOTOS_ERROR,
  UPLOAD_PHOTO_PENDING,
  UPLOAD_PHOTO_SUCCESS,
  UPLOAD_PHOTO_ERROR,
} from './actions';

const initialState = {
  pending: false,
  error: null,
  binarySource: null,
  allPictures: null,
};

export default function team(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_PHOTOS_PENDING:
      return {
        ...state,
        pending: true,
      };

    case GET_ALL_PHOTOS_SUCCESS:
      return {
        ...state,
        pending: false,
        allPictures: action.payload,
      };

    case GET_ALL_PHOTOS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case UPLOAD_PHOTO_PENDING:
      return {
        ...state,
        pending: true,
        binarySource: action.payload,
      };

    case UPLOAD_PHOTO_SUCCESS:
      return {
        ...state,
        pending: false,
        binarySource: null,
      };

    case UPLOAD_PHOTO_ERROR:
      return {
        ...state,
        pending: false,
        binarySource: null,
        error: action.error,
      };

    default:
      return state;
  }
}
