import { createAction } from '../../helpers';

export const USER_PROFILE_LOADED = 'USER_PROFILE_LOADED';
export const HANDLE_AUTHENTICATION_CALLBACK = 'HANDLE_AUTHENTICATION_CALLBACK';

export function handleAuthenticationCallback() {
  return createAction(HANDLE_AUTHENTICATION_CALLBACK);
}
