import { USER_PROFILE_LOADED } from './actions';

const initialState = null;

export default function user(state = initialState, action) {
  switch (action.type) {
    case USER_PROFILE_LOADED:
      return {
        ...state,
        ...action.user,
      };

    default:
      return state;
  }
}
