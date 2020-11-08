import {
  GET_PROFILE_PENDING,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_ERROR,
  SAVE_PROFILE_PENDING,
  SAVE_PROFILE_SUCCESS,
  SAVE_PROFILE_ERROR,
} from './actions';

const initialState = {
  pending: false,
  savePending: false,
  saveError: null,
  error: null,
  available: null,
  toSave: null,
};

export default function profile(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE_PENDING:
      return {
        ...state,
        pending: true,
        error: null,
      };

    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
        error: null,
      };

    case GET_PROFILE_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case SAVE_PROFILE_PENDING:
      return {
        ...state,
        saveError: null,
        savePending: true,
        toSave: action.payload,
      };

    case SAVE_PROFILE_SUCCESS:
      return {
        ...state,
        savePending: false,
        available: action.payload,
        toSave: null,
      };

    case SAVE_PROFILE_ERROR:
      return {
        ...state,
        savePending: false,
        saveError: action.error,
        toSave: null,
      };

    default:
      return state;
  }
}
