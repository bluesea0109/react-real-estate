import { UPLOAD_PHOTO_PENDING, UPLOAD_PHOTO_SUCCESS, UPLOAD_PHOTO_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  binarySource: null,
  uploadedUrl: null,
};

export default function team(state = initialState, action) {
  switch (action.type) {
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
        uploadedUrl: action.payload,
      };

    case UPLOAD_PHOTO_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
