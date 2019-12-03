import { UPLOAD_PHOTO_PENDING, UPLOAD_PHOTO_SUCCESS, UPLOAD_PHOTO_ERROR, DELETE_PHOTO_PENDING, DELETE_PHOTO_SUCCESS, DELETE_PHOTO_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  toUpload: null,
  realtorPhoto: null,
  teamLogo: null,
  brokerageLogo: null,
  toDelete: null,
};

export default function team(state = initialState, action) {
  switch (action.type) {
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
      return {
        ...state,
        pending: false,
        toUpload: null,
        error: action.error,
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

    default:
      return state;
  }
}
