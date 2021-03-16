import {
  SET_AGENT_OPEN,
  SET_BRAND_COLOR_OPEN,
  SET_CUSTOM_CTA_OPEN,
  SET_PHOTOS_OPEN,
  SET_POSTCARD_SIZE_OPEN,
  SET_RELOAD_IFRAMES,
  SET_RELOAD_IFRAMES_PENDING,
  SET_CUSTOM_UPLOAD_URL,
  SET_SIDEBAR_OPEN,
  SET_LIVE_EDIT_FIELDS,
  SET_LIVE_EDIT_BRAND_COLOR,
  SET_SELECTED_PHOTO,
} from './actions';

const initialState = {
  reloadIframes: false,
  reloadIframesPending: false,
  brandColorOpen: false,
  postcardSizeOpen: false,
  photosOpen: true,
  agentOpen: false,
  customCtaOpen: false,
  sidebarOpen: true,
  customUploadURL: '',
  selectedPhoto: '',
  edits: {
    fields: null,
    brandColor: '',
  },
};

export default function liveEditor(state = initialState, action) {
  switch (action.type) {
    case SET_RELOAD_IFRAMES:
      return {
        ...state,
        reloadIframes: action.payload,
      };
    case SET_RELOAD_IFRAMES_PENDING:
      return {
        ...state,
        reloadIframesPending: action.payload,
      };
    case SET_BRAND_COLOR_OPEN:
      return {
        ...state,
        brandColorOpen: action.payload,
      };
    case SET_POSTCARD_SIZE_OPEN:
      return {
        ...state,
        postcardSizeOpen: action.payload,
      };
    case SET_PHOTOS_OPEN:
      return {
        ...state,
        photosOpen: action.payload,
      };
    case SET_AGENT_OPEN:
      return {
        ...state,
        agentOpen: action.payload,
      };
    case SET_CUSTOM_CTA_OPEN:
      return {
        ...state,
        customCtaOpen: action.payload,
      };
    case SET_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: action.payload,
      };
    case SET_CUSTOM_UPLOAD_URL:
      return {
        ...state,
        customUploadURL: action.payload,
      };
    case SET_LIVE_EDIT_FIELDS:
      return {
        ...state,
        edits: {
          ...state.edits,
          fields: action.payload,
        },
      };
    case SET_LIVE_EDIT_BRAND_COLOR:
      return {
        ...state,
        edits: {
          ...state.edits,
          brandColor: action.payload,
        },
      };
    case SET_SELECTED_PHOTO:
      return {
        ...state,
        selectedPhoto: action.payload,
      };
    default:
      return state;
  }
}
