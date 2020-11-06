import { createAction } from '../../utils/helpers';

export const SELECT_PEER_ID = 'SELECT_PEER_ID';
export const DESELECT_PEER_ID = 'DESELECT_PEER_ID';

export function selectPeerId(payload) {
  return createAction(SELECT_PEER_ID, payload);
}

export function deselectPeerId() {
  return createAction(DESELECT_PEER_ID);
}
