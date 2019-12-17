import { createAction, createErrorAction } from '../../helpers';

export const GENERATE_TEAM_POSTCARDS_PREVIEW_PENDING = 'GENERATE_TEAM_POSTCARDS_PREVIEW_PENDING';
export const GENERATE_TEAM_POSTCARDS_PREVIEW_SUCCESS = 'GENERATE_TEAM_POSTCARDS_PREVIEW_SUCCESS';
export const GENERATE_TEAM_POSTCARDS_PREVIEW_ERROR = 'GENERATE_TEAM_POSTCARDS_PREVIEW_ERROR';

export function generateTeamPostcardsPreviewPending() {
  return createAction(GENERATE_TEAM_POSTCARDS_PREVIEW_PENDING);
}

export function generateTeamPostcardsPreviewSuccess(payload) {
  return createAction(GENERATE_TEAM_POSTCARDS_PREVIEW_SUCCESS, payload);
}

export function generateTeamPostcardsPreviewError(error) {
  return createErrorAction(GENERATE_TEAM_POSTCARDS_PREVIEW_ERROR, error);
}
