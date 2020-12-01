import { createAction } from '../../utils/helpers';

export const CLOSE_ALERT = 'CLOSE_ALERT';

export function closeAlert() {
  return createAction(CLOSE_ALERT);
}
