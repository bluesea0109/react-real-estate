import { CLOSE_ALERT } from './actions';

const initialState = {
  showAlert: true,
};

export default function ui(state = initialState, action) {
  switch (action.type) {
    case CLOSE_ALERT:
      return {
        ...state,
        showAlert: false,
      };

    default:
      return state;
  }
}
