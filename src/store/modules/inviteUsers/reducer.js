import { INVITE_USERS_PENDING, INVITE_USERS_SUCCESS, INVITE_USERS_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  peers: null,
};

export default function inviteUsers(state = initialState, action) {
  switch (action.type) {
    case INVITE_USERS_PENDING:
      return {
        ...state,
        pending: true,
        peers: action.payload,
      };

    case INVITE_USERS_SUCCESS:
      return {
        ...state,
        pending: false,
        peers: null,
      };

    case INVITE_USERS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
