import {
  GET_TEAM_PENDING,
  GET_TEAM_SUCCESS,
  GET_TEAM_ERROR,
  SYNC_PENDING,
  SYNC_SUCCESS,
  SYNC_ERROR,
} from './actions';

const initialState = {
  pending: false,
  syncPending: false,
  syncResponse: null,
  syncError: null,
  error: null,
  profiles: [],
};

export default function team(state = initialState, action) {
  switch (action.type) {
    case GET_TEAM_PENDING:
      return {
        ...state,
        pending: true,
      };

    case GET_TEAM_SUCCESS:
      return {
        ...state,
        pending: false,
        profiles: action.payload,
      };

    case GET_TEAM_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case SYNC_PENDING:
      return {
        ...state,
        syncPending: true,
        syncError: null,
      };

    case SYNC_SUCCESS:
      return {
        ...state,
        syncPending: false,
        syncResponse: action.payload,
        syncError: null,
      };

    case SYNC_ERROR:
      return {
        ...state,
        syncPending: false,
        syncError: action.error,
      };

    default:
      return state;
  }
}
