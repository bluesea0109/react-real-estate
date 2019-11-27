import { SET_ONBOARDED_STATUS, INCREMENT_STEP } from './actions';

const initialState = {
  status: false,
  step: 0,
};

export default function onboarded(state = initialState, action) {
  switch (action.type) {
    case SET_ONBOARDED_STATUS:
      return {
        ...state,
        status: action.payload,
      };

    case INCREMENT_STEP:
      return {
        ...state,
        step: action.payload,
      };

    default:
      return state;
  }
}
