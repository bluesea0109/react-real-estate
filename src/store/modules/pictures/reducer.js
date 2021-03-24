import {
  GET_PHOTO_PENDING,
  GET_PHOTO_SUCCESS,
  GET_PHOTO_ERROR,
  UPLOAD_PHOTO_PENDING,
  UPLOAD_PHOTO_SUCCESS,
  UPLOAD_PHOTO_ERROR,
  DELETE_PHOTO_PENDING,
  DELETE_PHOTO_SUCCESS,
  DELETE_PHOTO_ERROR,
  GET_PHOTO_LIBRARY_PENDING,
  GET_PHOTO_LIBRARY_SUCCESS,
  GET_PHOTO_LIBRARY_ERROR,
} from './actions';
import { DESELECT_PEER_ID, SELECT_PEER_ID } from '../peer/actions';

const initialState = {
  pending: false,
  error: null,
  toUpload: null,
  realtorPhoto: null,
  teamLogo: null,
  brokerageLogo: null,
  toDelete: null,
  photoLibrary: null,
  photoLibraryPending: null,
  photoLibraryError: null,
};

export default function pictures(state = initialState, action) {
  switch (action.type) {
    case SELECT_PEER_ID:
      return {
        pending: false,
        error: null,
        toUpload: null,
        realtorPhoto: null,
        teamLogo: null,
        brokerageLogo: null,
        toDelete: null,
      };

    case DESELECT_PEER_ID:
      return {
        pending: false,
        error: null,
        toUpload: null,
        realtorPhoto: null,
        teamLogo: null,
        brokerageLogo: null,
        toDelete: null,
      };

    case GET_PHOTO_PENDING:
      return {
        ...state,
        pending: true,
      };

    case GET_PHOTO_SUCCESS:
      return {
        ...state,
        pending: false,
        ...action.payload,
      };

    case GET_PHOTO_ERROR:
      return {
        ...state,
        pending: false,
        error: Object.assign({}, state.error, { get_realtorPhoto: action.error }),
      };

    case UPLOAD_PHOTO_PENDING:
      return {
        ...state,
        pending: true,
        toUpload: action.payload,
      };

    case UPLOAD_PHOTO_SUCCESS:
      let newData;

      if (action.payload.target === 'realtorPhoto') {
        newData = { realtorPhoto: action.payload.data };
      }

      if (action.payload.target === 'teamLogo') {
        newData = { teamLogo: action.payload.data };
      }

      if (action.payload.target === 'brokerageLogo') {
        newData = { brokerageLogo: action.payload.data };
      }

      return {
        ...state,
        pending: false,
        toUpload: null,
        ...newData,
      };

    case UPLOAD_PHOTO_ERROR:
      let uploadPhotoError;

      if (action.error.target === 'realtorPhoto') {
        uploadPhotoError = { upload_realtorPhoto: action.error.data };
      }

      if (action.error.target === 'teamLogo') {
        uploadPhotoError = { upload_teamLogo: action.error.data };
      }

      if (action.error.target === 'brokerageLogo') {
        uploadPhotoError = { upload_brokerageLogo: action.error.data };
      }

      return {
        ...state,
        pending: false,
        toUpload: null,
        error: Object.assign({}, state.error, uploadPhotoError),
      };

    case DELETE_PHOTO_PENDING:
      return {
        ...state,
        pending: true,
        toDelete: action.payload,
      };

    case DELETE_PHOTO_SUCCESS:
      let removeData;

      if (action.payload.target === 'teamLogo') {
        removeData = { teamLogo: null };
      }

      return {
        ...state,
        pending: false,
        toDelete: null,
        ...removeData,
      };

    case DELETE_PHOTO_ERROR:
      return {
        ...state,
        pending: false,
        toDelete: null,
        error: action.error,
      };

    case GET_PHOTO_LIBRARY_PENDING:
      return {
        ...state,
        photoLibraryPending: true,
      };

    case GET_PHOTO_LIBRARY_SUCCESS:
      return {
        ...state,
        photoLibraryPending: false,
        photoLibrary: action.payload,
      };

    case GET_PHOTO_LIBRARY_ERROR:
      return {
        ...state,
        photoLibraryPending: false,
        photoLibraryError: action.error,
      };

    default:
      return state;
  }
}
