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
  UPDATE_MAILOUT_NAME_PENDING,
  UPDATE_MAILOUT_NAME_SUCCESS,
  UPDATE_MAILOUT_NAME_ERROR,
  CHANGE_MAILOUT_DISPLAY_AGENT_PENDING,
  CHANGE_MAILOUT_DISPLAY_AGENT_SUCCESS,
  CHANGE_MAILOUT_DISPLAY_AGENT_ERROR,
  GET_MAILOUT_EDIT_PENDING,
  GET_MAILOUT_EDIT_SUCCESS,
  GET_MAILOUT_EDIT_ERROR,
  UPDATE_MAILOUT_EDIT_PENDING,
  UPDATE_MAILOUT_EDIT_SUCCESS,
  UPDATE_MAILOUT_EDIT_ERROR,
  UPDATE_MAILOUT_TEMPLATE_THEME_PENDING,
  UPDATE_MAILOUT_TEMPLATE_THEME_SUCCESS,
  UPDATE_MAILOUT_TEMPLATE_THEME_ERROR,
  UPDATE_MAILOUT_EDIT_POLYGON_COORDINATES,
  REVERT_MAILOUT_EDIT_PENDING,
  REVERT_MAILOUT_EDIT_SUCCESS,
  REVERT_MAILOUT_EDIT_ERROR,
  ARCHIVE_MAILOUT_PENDING,
  ARCHIVE_MAILOUT_ERROR,
  ARCHIVE_MAILOUT_SUCCESS,
  UNDO_ARCHIVE_MAILOUT_PENDING,
  UNDO_ARCHIVE_MAILOUT_SUCCESS,
  UNDO_ARCHIVE_MAILOUT_ERROR,
  DUPLICATE_MAILOUT_PENDING,
  DUPLICATE_MAILOUT_ERROR,
  DUPLICATE_MAILOUT_SUCCESS,
  SET_MAILOUT_ERROR,
  CLEAR_MAILOUT_ERROR,
  SET_ADD_MAILOUT_ERROR,
  CLEAR_ADD_MAILOUT_ERROR,
} from './actions';

const initialState = {
  pending: false,
  submitPending: false,
  stopPending: false,
  updateMailoutSizePending: false,
  updateMailoutNamePending: false,
  changeDisplayAgentPending: false,
  getMailoutEditPending: false,
  updateMailoutEditPending: false,
  updateMailoutTemplateThemePending: false,
  revertMailoutEditPending: false,
  archivePending: false,

  mailoutPolygonCoordinates: null,
  mailoutId: null,
  mailoutEdit: null,
  mailoutSize: null,
  mailoutName: null,
  mailoutDisplayAgent: null,
  details: null,
  archiveId: null,

  addMailoutError: null,
  error: null,
  submitError: null,
  stopError: null,
  updateMailoutSizeError: null,
  updateMailoutNameError: null,
  changeDisplayAgentError: null,
  getMailoutEditError: null,
  updateMailoutEditError: null,
  updateMailoutTemplateThemeError: null,
  revertMailoutEditError: null,
  archiveError: null,
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
        mailoutEdit: null,
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

    case UPDATE_MAILOUT_NAME_PENDING:
      return {
        ...state,
        updateMailoutNamePending: true,
        mailoutName: action.payload.name,
        mailoutId: action.payload.mailoutId,
        updateMailoutNameError: null,
        details: {
          ...state.details,
          name: action.payload.name,
        },
      };

    case UPDATE_MAILOUT_NAME_SUCCESS:
      return {
        ...state,
        updateMailoutNamePending: false,
        mailoutName: null,
        mailoutId: null,
        updateMailoutNameError: null,
      };

    case UPDATE_MAILOUT_NAME_ERROR:
      return {
        ...state,
        mailoutName: null,
        mailoutId: null,
        updateMailoutNamePending: false,
        updateMailoutNameError: action.error,
      };

    case CHANGE_MAILOUT_DISPLAY_AGENT_PENDING:
      return {
        ...state,
        changeDisplayAgentPending: true,
        mailoutDisplayAgent: action.payload.userId,
        mailoutEdit: {
          ...state.mailoutEdit,
          mailoutDisplayAgent: action.payload,
        },
        changeDisplayAgentError: null,
      };

    case CHANGE_MAILOUT_DISPLAY_AGENT_SUCCESS:
      return {
        ...state,
        changeDisplayAgentPending: false,
        mailoutDisplayAgent: null,
        mailoutEdit: {
          ...state.mailoutEdit,
          fields: action.payload,
        },
        changeDisplayAgentError: null,
      };

    case CHANGE_MAILOUT_DISPLAY_AGENT_ERROR:
      return {
        ...state,
        changeDisplayAgentPending: false,
        mailoutDisplayAgent: null,
        changeDisplayAgentError: action.error,
      };

    case GET_MAILOUT_EDIT_PENDING:
      return {
        ...state,
        getMailoutEditPending: true,
        getMailoutEditError: null,
      };

    case GET_MAILOUT_EDIT_SUCCESS:
      return {
        ...state,
        getMailoutEditPending: false,
        mailoutEdit: {
          ...action.payload,
        },
        getMailoutEditError: null,
      };

    case GET_MAILOUT_EDIT_ERROR:
      return {
        ...state,
        getMailoutEditPending: false,
        getMailoutEditError: action.error,
      };

    case UPDATE_MAILOUT_EDIT_PENDING:
      return {
        ...state,
        updateMailoutEditPending: true,
        mailoutEdit: action.payload,
        updateMailoutEditError: null,
      };

    case UPDATE_MAILOUT_EDIT_SUCCESS:
      return {
        ...state,
        details: action.payload,
        updateMailoutEditPending: false,
        mailoutEdit: null,
      };

    case UPDATE_MAILOUT_EDIT_ERROR:
      return {
        ...state,
        updateMailoutEditPending: false,
        updateMailoutEditError: action.error,
      };

    case UPDATE_MAILOUT_TEMPLATE_THEME_PENDING:
      return {
        ...state,
        updateMailoutTemplateThemePending: true,
        mailoutEdit: {
          ...state.mailoutEdit,
          templateTheme: action.payload.templateUuid,
          intentPath: action.payload.intentPath,
        },
        details: {
          ...state.details,
          templateTheme: action.payload.templateUuid,
          intentPath: action.payload.intentPath,
        },
        updateMailoutTemplateThemeError: null,
      };

    case UPDATE_MAILOUT_TEMPLATE_THEME_SUCCESS:
      return {
        ...state,
        mailoutEdit: {
          ...state.mailoutEdit,
          fields: action.payload.fields,
        },
        updateMailoutTemplateThemePending: false,
      };

    case UPDATE_MAILOUT_TEMPLATE_THEME_ERROR:
      return {
        ...state,
        updateMailoutTemplateThemePending: false,
        updateMailoutTemplateThemeError: action.error,
      };

    case UPDATE_MAILOUT_EDIT_POLYGON_COORDINATES:
      return {
        ...state,
        mailoutPolygonCoordinates: action.payload,
      };

    case REVERT_MAILOUT_EDIT_PENDING:
      return {
        ...state,
        revertMailoutEditPending: true,
        revertMailoutEditError: null,
      };

    case REVERT_MAILOUT_EDIT_SUCCESS:
      return {
        ...state,
        revertMailoutEditPending: false,
        details: action.payload,
        mailoutEdit: null,
        revertMailoutEditError: null,
      };

    case REVERT_MAILOUT_EDIT_ERROR:
      return {
        ...state,
        revertMailoutEditPending: false,
        revertMailoutEditError: action.error,
      };

    case ARCHIVE_MAILOUT_PENDING:
      return {
        ...state,
        archiveId: action.payload,
        archivePending: true,
      };
    case ARCHIVE_MAILOUT_SUCCESS:
      return {
        ...state,
        archiveId: null,
        archivePending: false,
      };
    case ARCHIVE_MAILOUT_ERROR:
      return {
        ...state,
        archivePending: false,
        archiveId: null,
        archiveError: action.error,
      };
    case UNDO_ARCHIVE_MAILOUT_PENDING:
      return {
        ...state,
        archiveId: action.payload,
        archivePending: true,
      };
    case UNDO_ARCHIVE_MAILOUT_SUCCESS:
      return {
        ...state,
        archiveId: null,
        archivePending: false,
      };
    case UNDO_ARCHIVE_MAILOUT_ERROR:
      return {
        ...state,
        archivePending: false,
        archiveId: null,
        archiveError: action.error,
      };

    case DUPLICATE_MAILOUT_PENDING:
      return {
        ...state,
        pending: true,
        mailoutId: action.payload,
        error: null,
      };

    case DUPLICATE_MAILOUT_SUCCESS:
      console.log('success payload', action.payload);
      console.log('success payload with state ', state);
      return {
        ...state,
        pending: false,
        details: action.payload,
        error: null,
      };

    case DUPLICATE_MAILOUT_ERROR:
      console.log('state', state);
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case SET_MAILOUT_ERROR:
      return {
        ...state,
        error: {
          message: action.payload,
        },
      };
    case CLEAR_MAILOUT_ERROR:
      return {
        ...state,
        error: null,
      };
    case SET_ADD_MAILOUT_ERROR:
      return {
        ...state,
        addMailoutError: {
          message: action.payload,
        },
      };
    case CLEAR_ADD_MAILOUT_ERROR:
      return {
        ...state,
        addMailoutError: null,
      };
    default:
      return state;
  }
}
