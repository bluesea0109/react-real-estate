import { put, call, delay, take, race, select } from 'redux-saga/effects';

import {
  INITIALIZE_TEAM_POLLING_START,
  INITIALIZE_TEAM_POLLING_STOP,
  initializeTeamPending,
  initializeTeamSuccess,
  initializeTeamError,
  initializeTeamPollingStop,
} from './actions';
import { getMailoutsPending } from '../mailouts/actions';

import ApiService from '../../../services/api/index';

export const getCurrentUserId = state => state.onLogin.user && state.onLogin.user._id;

export function* initializePollSagaWorker() {
  while (true) {
    try {
      const currentUserId = yield select(getCurrentUserId);
      yield put(initializeTeamPending());

      const { path, method } = ApiService.directory.team.listing.poll();
      const response = yield call(ApiService[method], path);

      let currentUserTotal = 0;
      let currentUserCompleted = 0;
      let campaignsTotalForAllUsers = 0;
      let campaignsCompletedForAllUsers = 0;

      for (const user of response.completed) {
        if (user.userId === currentUserId) {
          currentUserTotal = currentUserTotal += user.campaignsTotal;
          currentUserCompleted = currentUserCompleted += user.campaignsCompleted;
        }

        campaignsTotalForAllUsers = campaignsTotalForAllUsers += user.campaignsTotal;
        campaignsCompletedForAllUsers = campaignsCompletedForAllUsers += user.campaignsCompleted;
      }

      response.campaignsTotalForAllUsers = campaignsTotalForAllUsers;
      response.campaignsCompletedForAllUsers = campaignsCompletedForAllUsers;

      yield put(initializeTeamSuccess(response));
      if (currentUserTotal !== currentUserCompleted) yield put(getMailoutsPending());
      if (campaignsTotalForAllUsers === campaignsCompletedForAllUsers) yield put(initializeTeamPollingStop());
      yield delay(2000);
    } catch (err) {
      yield put(initializeTeamError(err.message));
    }
  }
}

export default function* initializePollSagaWatcher() {
  while (true) {
    yield take(INITIALIZE_TEAM_POLLING_START);
    yield race([call(initializePollSagaWorker), take(INITIALIZE_TEAM_POLLING_STOP)]);
  }
}
