import { GET_ON_LOGIN_PENDING, GET_ON_LOGIN_SUCCESS, GET_ON_LOGIN_ERROR } from './actions';
import { DELETE_PHOTO_SUCCESS } from '../pictures/actions';

const initialState = {
  pending: false,
  error: null,
  mode: null,
  permissions: undefined,
};

export default function onLogin(state = initialState, action) {
  switch (action.type) {
    case GET_ON_LOGIN_PENDING:
      return {
        ...state,
        pending: true,
      };

    case GET_ON_LOGIN_SUCCESS:
      return {
        ...state,
        pending: false,
        mode: action.payload.mode,
        permissions: action.payload.permissions ? action.payload.permissions : undefined,
        ...action.payload.fullUser,
      };

    case GET_ON_LOGIN_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case DELETE_PHOTO_SUCCESS:
      return {
        ...state,
        teamLogo: null,
      };

    default:
      return state;
  }
}
