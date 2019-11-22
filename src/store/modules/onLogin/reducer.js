import { FETCH_ON_LOGIN_PENDING, FETCH_ON_LOGIN_SUCCESS, FETCH_ON_LOGIN_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  mode: null,
  permissions: undefined,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case FETCH_ON_LOGIN_PENDING:
      return {
        ...state,
        pending: true,
      };

    case FETCH_ON_LOGIN_SUCCESS:
      return {
        ...state,
        pending: false,
        mode: action.payload.mode,
        permissions: action.payload.permissions ? action.payload.permissions : undefined,
        ...action.payload.fullUser,
      };

    case FETCH_ON_LOGIN_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
