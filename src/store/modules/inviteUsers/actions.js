import { createAction, createErrorAction } from '../../helpers';

export const INVITE_USERS_PENDING = 'INVITE_USERS_PENDING';
export const INVITE_USERS_SUCCESS = 'INVITE_USERS_SUCCESS';
export const INVITE_USERS_ERROR = 'INVITE_USERS_ERROR';

export const SKIP_INVITE_USERS = 'SKIP_INVITE_USERS';

export function inviteUsersPending(payload) {
  return createAction(INVITE_USERS_PENDING, payload);
}

export function inviteUsersSuccess(payload) {
  return createAction(INVITE_USERS_SUCCESS, payload);
}

export function inviteUsersError(error) {
  return createErrorAction(INVITE_USERS_ERROR, error);
}

export function skipInviteUsers() {
  return createAction(SKIP_INVITE_USERS);
}
