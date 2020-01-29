import {
  GET_MAILOUT_PENDING,
  GET_MAILOUT_SUCCESS,
  GET_MAILOUT_ERROR,
  SUBMIT_MAILOUT_PENDING,
  SUBMIT_MAILOUT_SUCCESS,
  SUBMIT_MAILOUT_ERROR,
  STOP_MAILOUT_PENDING,
  STOP_MAILOUT_SUCCESS,
  STOP_MAILOUT_ERROR,
  RESET_MAILOUT,
  UPDATE_MAILOUT_SIZE_PENDING,
  UPDATE_MAILOUT_SIZE_SUCCESS,
  UPDATE_MAILOUT_SIZE_ERROR,
  CHECK_IF_MAILOUT_NEEDS_UPDATE_PENDING,
  CHECK_IF_MAILOUT_NEEDS_UPDATE_SUCCESS,
  CHECK_IF_MAILOUT_NEEDS_UPDATE_ERROR,
  UPDATE_MAILOUT_PENDING,
  UPDATE_MAILOUT_SUCCESS,
  UPDATE_MAILOUT_ERROR,
  MODIFY_MAILOUT_PENDING,
  MODIFY_MAILOUT_SUCCESS,
  MODIFY_MAILOUT_ERROR,
  CHANGE_MAILOUT_DISPLAY_AGENT_PENDING,
  CHANGE_MAILOUT_DISPLAY_AGENT_SUCCESS,
  CHANGE_MAILOUT_DISPLAY_AGENT_ERROR,
} from './actions';

const initialState = {
  pending: false,
  modifyPending: false,
  submitPending: false,
  stopPending: false,
  updateMailoutSizePending: false,
  needsUpdatePending: false,
  updatePending: false,
  changeDisplayAgentPending: false,

  mailoutId: null,
  mailoutEdit: null,
  mailoutSize: null,
  mailoutDisplayAgent: null,
  needsUpdate: null,
  details: null,

  error: null,
  modifyError: null,
  submitError: null,
  stopError: null,
  updateMailoutSizeError: null,
  needsUpdateError: null,
  updateError: null,
  changeDisplayAgentError: null,
};

export default function mailout(state = initialState, action) {
  switch (action.type) {
    case GET_MAILOUT_PENDING:
      return {
        ...state,
        pending: true,
        mailoutId: action.payload,
        error: null,
      };

    case GET_MAILOUT_SUCCESS:
      return {
        ...state,
        pending: false,
        details: action.payload,
        error: null,
      };

    case GET_MAILOUT_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case MODIFY_MAILOUT_PENDING:
      return {
        ...state,
        modifyPending: true,
        mailoutEdit: action.payload,
        modifyError: null,
      };

    case MODIFY_MAILOUT_SUCCESS:
      return {
        ...state,
        details: action.payload,
        modifyPending: false,
        mailoutEdit: null,
      };

    case MODIFY_MAILOUT_ERROR:
      return {
        ...state,
        modifyPending: false,
        modifyError: action.error,
      };

    case SUBMIT_MAILOUT_PENDING:
      return {
        ...state,
        submitPending: true,
        mailoutId: action.payload,
        submitError: null,
      };

    case SUBMIT_MAILOUT_SUCCESS:
      return {
        ...state,
        submitPending: false,
        details: action.payload,
        submitError: null,
      };

    case SUBMIT_MAILOUT_ERROR:
      return {
        ...state,
        submitPending: false,
        submitError: action.error,
      };

    case STOP_MAILOUT_PENDING:
      return {
        ...state,
        stopPending: true,
        mailoutId: action.payload,
        stopError: null,
      };

    case STOP_MAILOUT_SUCCESS:
      return {
        ...state,
        stopPending: false,
        details: action.payload,
        stopError: null,
      };

    case STOP_MAILOUT_ERROR:
      return {
        ...state,
        stopPending: false,
        stopError: action.error,
      };

    case RESET_MAILOUT:
      return {
        ...state,
        mailoutId: null,
        details: null,
        error: null,
      };

    case UPDATE_MAILOUT_SIZE_PENDING:
      return {
        ...state,
        updateMailoutSizePending: true,
        mailoutSize: action.payload,
        updateMailoutSizeError: null,
      };

    case UPDATE_MAILOUT_SIZE_SUCCESS:
      return {
        ...state,
        updateMailoutSizePending: false,
        mailoutSize: null,
        updateMailoutSizeError: null,
      };

    case UPDATE_MAILOUT_SIZE_ERROR:
      return {
        ...state,
        updateMailoutSizePending: false,
        updateMailoutSizeError: action.error,
      };

    case CHECK_IF_MAILOUT_NEEDS_UPDATE_PENDING:
      return {
        ...state,
        needsUpdatePending: false,
        needsUpdate: null,
        needsUpdateError: null,
      };

    case CHECK_IF_MAILOUT_NEEDS_UPDATE_SUCCESS:
      return {
        ...state,
        needsUpdatePending: true,
        needsUpdate: action.payload,
        needsUpdateError: null,
      };

    case CHECK_IF_MAILOUT_NEEDS_UPDATE_ERROR:
      return {
        ...state,
        needsUpdatePending: false,
        needsUpdateError: action.error,
      };

    case UPDATE_MAILOUT_PENDING:
      return {
        ...state,
        updatePending: true,
        updateError: null,
      };

    case UPDATE_MAILOUT_SUCCESS:
      return {
        ...state,
        updatePending: false,
        details: action.payload,
        updateError: null,
      };

    case UPDATE_MAILOUT_ERROR:
      return {
        ...state,
        updatePending: false,
        updateError: action.error,
      };

    case CHANGE_MAILOUT_DISPLAY_AGENT_PENDING:
      return {
        ...state,
        changeDisplayAgentPending: true,
        mailoutDisplayAgent: action.payload,
        changeDisplayAgentError: null,
      };

    case CHANGE_MAILOUT_DISPLAY_AGENT_SUCCESS:
      return {
        ...state,
        changeDisplayAgentPending: false,
        mailoutDisplayAgent: null,
        details: action.payload,
        changeDisplayAgentError: null,
      };

    case CHANGE_MAILOUT_DISPLAY_AGENT_ERROR:
      return {
        ...state,
        changeDisplayAgentPending: false,
        mailoutDisplayAgent: null,
        changeDisplayAgentError: action.error,
      };

    default:
      return state;
  }
}
