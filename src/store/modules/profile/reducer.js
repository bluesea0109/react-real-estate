import { SAVE_PROFILE_PENDING, SAVE_PROFILE_SUCCESS, SAVE_PROFILE_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  available: null,
  toSave: null,
};

export default function profile(state = initialState, action) {
  switch (action.type) {
    case SAVE_PROFILE_PENDING:
      return {
        ...state,
        error: null,
        pending: true,
        toSave: action.payload,
      };

    case SAVE_PROFILE_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
        toSave: null,
      };

    case SAVE_PROFILE_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
