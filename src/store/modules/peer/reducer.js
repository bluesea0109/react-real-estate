import { SELECT_PEER_ID, DESELECT_PEER_ID } from './actions';

const initialState = {
  peerId: null,
};

export default function peer(state = initialState, action) {
  switch (action.type) {
    case SELECT_PEER_ID:
      return {
        ...state,
        peerId: action.payload,
      };

    case DESELECT_PEER_ID:
      return {
        ...state,
        peerId: null,
      };

    default:
      return state;
  }
}
