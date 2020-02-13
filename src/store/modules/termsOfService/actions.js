import { createAction } from '../../helpers';

export const TERMS_OF_SERVICE_PENDING = 'TERMS_OF_SERVICE_PENDING';
export const TERMS_OF_SERVICE_ACCEPTED = 'TERMS_OF_SERVICE_ACCEPTED';
export const TERMS_OF_SERVICE_REJECTED = 'TERMS_OF_SERVICE_REJECTED';

export function termsOfServicePending() {
  return createAction(TERMS_OF_SERVICE_PENDING);
}

export function termsOfServiceAccepted() {
  return createAction(TERMS_OF_SERVICE_ACCEPTED);
}

export function termsOfServiceRejected() {
  return createAction(TERMS_OF_SERVICE_REJECTED);
}
