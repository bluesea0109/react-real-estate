import { UPLOAD_PHOTO_PENDING, UPLOAD_PHOTO_SUCCESS, UPLOAD_PHOTO_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  binarySource: null,
  realtorPhoto: null,
  teamLogo: null,
  brokerageLogo: null,
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
        binarySource: null,
        ...newData,
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
