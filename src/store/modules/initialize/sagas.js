import { put, call, delay, take, race } from 'redux-saga/effects';

import { INITIALIZE_TEAM_POLLING_START, INITIALIZE_TEAM_POLLING_STOP, initializeTeamPending, initializeTeamSuccess, initializeTeamError } from './actions';

import ApiService from '../../../services/api/index';

export function* initializePollSagaWorker() {
  while (true) {
    try {
      yield put(initializeTeamPending());

      const { path, method } = ApiService.directory.team.listing.poll();
      const response = yield call(ApiService[method], path);

      console.log('response', response);

      yield put(initializeTeamSuccess(response));
      yield delay(20000);
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
