import { SET_RELOAD_IFRAMES, SET_RELOAD_IFRAMES_PENDING } from './actions';

const initialState = {
  reloadIframes: false,
  reloadIframesPending: false,
};

export default function liveEditor(state = initialState, action) {
  switch (action.type) {
    case SET_RELOAD_IFRAMES:
      return {
        ...state,
        reloadIframes: action.payload,
      };
    case SET_RELOAD_IFRAMES_PENDING:
      return {
        ...state,
        reloadIframesPending: action.payload,
      };
    default:
      return state;
  }
}
