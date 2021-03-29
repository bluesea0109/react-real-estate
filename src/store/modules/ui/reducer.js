import { CLOSE_ALERT, SHOW_BARS } from './actions';

const initialState = {
  showAlert: true,
  showBars: [],
};

export default function ui(state = initialState, action) {
  switch (action.type) {
    case CLOSE_ALERT:
      return {
        ...state,
        showAlert: false,
      };

    case SHOW_BARS:
      return {
        ...state,
        showBars: action.payload,
      };

    default:
      return state;
  }
}
