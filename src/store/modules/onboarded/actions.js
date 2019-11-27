import { createAction } from '../../helpers';

export const SET_ONBOARDED_STATUS = 'SET_ONBOARDED_STATUS';
export const INCREMENT_STEP = 'INCREMENT_STEP';

export function setOnboardedStatus(payload) {
  return createAction(SET_ONBOARDED_STATUS, payload);
}

export function incrementStep(payload) {
  return createAction(INCREMENT_STEP, payload);
}
