import {
  GET_MAILOUTS_PENDING,
  GET_MAILOUTS_SUCCESS,
  GET_MAILOUTS_ERROR,
  TOGGLE_CAN_GET_MORE,
  GET_MORE_MAILOUTS_PENDING,
  GET_MORE_MAILOUTS_SUCCESS,
  GET_MORE_MAILOUTS_ERROR,
  RESET_MAILOUTS,
  GENERATE_MAILOUTS_PENDING,
  GENERATE_MAILOUTS_SUCCESS,
  GENERATE_MAILOUTS_ERROR,
  GET_ARCHIVED_MAILOUTS_PENDING,
  GET_ARCHIVED_MAILOUTS_SUCCESS,
  GET_ARCHIVED_MAILOUTS_ERROR,
  GET_MORE_ARCHIVED_MAILOUTS_PENDING,
  GET_MORE_ARCHIVED_MAILOUTS_SUCCESS,
  GET_MORE_ARCHIVED_MAILOUTS_ERROR,
  ADD_CAMPAIGN_START,
  ADD_CAMPAIGN_SUCCESS,
  ADD_CAMPAIGN_ERROR,
  ADD_CAMPAIGN_RESET,
  ADD_HOLIDAY_CAMPAIGN_START,
  ADD_HOLIDAY_CAMPAIGN_SUCCESS,
  ADD_HOLIDAY_CAMPAIGN_ERROR,
  SET_MAILOUTS_ERROR,
  CLEAR_MAILOUTS_ERROR,
  SHOW_ADD_CAMPAIGN_MODAL,
  HIDE_ADD_CAMPAIGN_MODAL,
} from './actions';
import { ARCHIVE_MAILOUT_SUCCESS, UNDO_ARCHIVE_MAILOUT_SUCCESS } from '../mailout/actions';

const initialState = {
  pending: false,
  pendingArchived: false,
  generatePending: false,
  canLoadMore: false,
  page: 1,
  list: [],
  archivedPage: 1,
  archived: [],
  error: null,
  generateError: false,
  addCampaignPending: false,
  addCampaignSuccess: false,
  addCampaignResponse: null,
  addCampaignHoliday: null,
  addCampaignMlsNum: null,
  showAddCampaignModal: false,
  showChoosePostcardSize: false,
};

export default function mailouts(state = initialState, action) {
  switch (action.type) {
    case GET_MAILOUTS_PENDING:
      return {
        ...state,
        page: 1,
        pending: true,
      };

    case GET_MAILOUTS_SUCCESS:
      return {
        ...state,
        pending: false,
        list: action.payload,
      };

    case GET_MAILOUTS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case TOGGLE_CAN_GET_MORE:
      return {
        ...state,
        canLoadMore: action.payload,
      };

    case GET_MORE_MAILOUTS_PENDING:
      return {
        ...state,
        pending: true,
        page: action.payload,
      };

    case GET_MORE_MAILOUTS_SUCCESS:
      const getMoreMailoutsNewList = state.list.concat(action.payload);

      return {
        ...state,
        pending: false,
        list: getMoreMailoutsNewList,
      };

    case GET_MORE_MAILOUTS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    case RESET_MAILOUTS:
      return {
        ...state,
        canLoadMore: false,
        page: 1,
        archivedPage: 1,
        archived: [],
        list: [],
        error: null,
      };

    case GENERATE_MAILOUTS_PENDING:
      return {
        ...state,
        generatePending: true,
      };

    case GENERATE_MAILOUTS_SUCCESS:
      return {
        ...state,
        generatePending: false,
        list: action.payload,
      };

    case GENERATE_MAILOUTS_ERROR:
      return {
        ...state,
        generatePending: false,
        generateError: action.error,
      };
    case GET_ARCHIVED_MAILOUTS_PENDING:
      return {
        ...state,
        archivedPage: 1,
        pendingArchived: true,
      };

    case GET_ARCHIVED_MAILOUTS_SUCCESS:
      return {
        ...state,
        pendingArchived: false,
        archived: action.payload,
      };

    case GET_ARCHIVED_MAILOUTS_ERROR:
      return {
        ...state,
        pendingArchived: false,
        error: action.error,
      };
    case GET_MORE_ARCHIVED_MAILOUTS_PENDING:
      return {
        ...state,
        pendingArchived: true,
        archivedPage: action.payload,
      };

    case GET_MORE_ARCHIVED_MAILOUTS_SUCCESS:
      const getMoreArchivedMailoutsNewList = state.archived.concat(action.payload);

      return {
        ...state,
        pendingArchived: false,
        archived: getMoreArchivedMailoutsNewList,
      };

    case GET_MORE_ARCHIVED_MAILOUTS_ERROR:
      return {
        ...state,
        pendingArchived: false,
        error: action.error,
      };
    case ARCHIVE_MAILOUT_SUCCESS:
      return {
        ...state,
        list: state.list.filter(item => item._id !== action.payload._id),
      };
    case UNDO_ARCHIVE_MAILOUT_SUCCESS:
      return {
        ...state,
        archived: state.archived.filter(item => item._id !== action.payload._id),
      };
    case ADD_CAMPAIGN_START:
      return {
        ...state,
        addCampaignMlsNum: action.payload,
        addCampaignPending: true,
        error: null,
      };
    case ADD_CAMPAIGN_SUCCESS:
      let newMlsList = [...state.list];
      newMlsList.unshift(action.payload);
      if (state.canLoadMore) newMlsList.pop();
      return {
        ...state,
        list: newMlsList,
        AddCampaignSuccess: true,
        addCampaignPending: false,
        addCampaignResponse: action.payload,
        error: null,
      };
    case ADD_CAMPAIGN_ERROR:
      return {
        ...state,
        addCampaignPending: false,
        error: action.error,
      };
    case ADD_CAMPAIGN_RESET:
      return {
        ...state,
        addCampaignMlsNum: null,
        addCampaignHoliday: null,
        AddCampaignSuccess: false,
        addCampaignPending: false,
        addCampaignResponse: null,
        error: null,
      };
    case ADD_HOLIDAY_CAMPAIGN_START:
      return {
        ...state,
        addCampaignHoliday: action.payload,
        addCampaignPending: true,
        error: null,
      };
    case ADD_HOLIDAY_CAMPAIGN_SUCCESS:
      let newHolidayList = [...state.list];
      newHolidayList.unshift(action.payload);
      if (state.canLoadMore) newHolidayList.pop();
      return {
        ...state,
        list: newHolidayList,
        addCampaignPending: false,
        addCampaignSuccess: true,
        addCampaignResponse: action.payload,
        error: null,
      };
    case ADD_HOLIDAY_CAMPAIGN_ERROR:
      return {
        ...state,
        addCampaignPending: false,
        error: action.error,
      };
    case SET_MAILOUTS_ERROR:
      return {
        ...state,
        error: {
          message: action.payload,
        },
      };
    case CLEAR_MAILOUTS_ERROR:
      return {
        ...state,
        error: null,
      };
    case SHOW_ADD_CAMPAIGN_MODAL:
      return {
        ...state,
        showAddCampaignModal: true,
        showChoosePostcardSize: true,
      };
    case HIDE_ADD_CAMPAIGN_MODAL:
      return {
        ...state,
        showAddCampaignModal: false,
        showChoosePostcardSize: false,
      };

    default:
      return state;
  }
}
