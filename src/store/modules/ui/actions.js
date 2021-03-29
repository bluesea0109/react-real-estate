import { createAction } from '../../utils/helpers';

export const CLOSE_ALERT = 'CLOSE_ALERT';
export const SHOW_BARS = 'SHOW_BARS';

export function closeAlert() {
  return createAction(CLOSE_ALERT);
}

export function showBars(payload) {
  return createAction(SHOW_BARS, payload);
}
