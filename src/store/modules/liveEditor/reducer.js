import {
  SET_AGENT_OPEN,
  SET_BRAND_COLOR_OPEN,
  SET_CUSTOM_CTA_OPEN,
  SET_PHOTOS_OPEN,
  SET_POSTCARD_SIZE_OPEN,
  SET_RELOAD_IFRAMES,
  SET_RELOAD_IFRAMES_PENDING,
  SET_REPLACE_FIELD_DATA,
  SET_CUSTOM_UPLOAD_URL,
  SET_SIDEBAR_OPEN,
  SET_LIVE_EDIT_FIELDS,
  SET_LIVE_EDIT_BRAND_COLOR,
  SET_SELECTED_PHOTO,
  SET_ZOOM_VALUE,
  SET_SELECTED_TEMPLATE,
  SET_BIG_PHOTO,
  SET_EDITING_ELEMENT,
  SET_EDITING_SIDE,
  SET_FONT_SIZE_VALUE,
  SET_STENCIL_EDITS,
  UPDATE_ELEMENT_CSS,
} from './actions';

const initialState = {
  reloadIframes: false,
  reloadIframesPending: false,
  replaceFieldData: false,
  brandColorOpen: false,
  postcardSizeOpen: false,
  photosOpen: false,
  agentOpen: false,
  customCtaOpen: false,
  sidebarOpen: true,
  customUploadURL: '',
  selectedPhoto: '',
  bigPhoto: '',
  zoomValue: 1,
  selectedTemplate: true,
  editingElement: null,
  editingSide: null,
  fontSizeValue: null,
  edits: {
    fields: null,
    brandColor: '',
    stencilEdits: [],
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
    case SET_REPLACE_FIELD_DATA:
      return {
        ...state,
        replaceFieldData: action.payload,
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
    case SET_BIG_PHOTO:
      return {
        ...state,
        bigPhoto: action.payload,
      };
    case SET_ZOOM_VALUE:
      return {
        ...state,
        zoomValue: action.payload,
      };
    case SET_SELECTED_TEMPLATE:
      return {
        ...state,
        selectedTemplate: action.payload,
      };
    case SET_EDITING_ELEMENT:
      return {
        ...state,
        editingElement: action.payload,
      };
    case SET_EDITING_SIDE:
      return {
        ...state,
        editingSide: action.payload,
      };
    case SET_FONT_SIZE_VALUE:
      return {
        ...state,
        fontSizeValue: action.payload,
      };
    case SET_STENCIL_EDITS:
      return {
        ...state,
        edits: {
          ...state.edits,
          stencilEdits: action.payload,
        },
      };
    case UPDATE_ELEMENT_CSS:
      const id = action.payload.id;
      const cssPartial = `#${id}{${action.payload.css}}`;
      const elementIndex = state.edits.stencilEdits.findIndex(el => el.id === id);
      let newEdits = [...state.edits.stencilEdits];
      if (elementIndex !== -1) {
        newEdits[elementIndex].cssPartial = cssPartial;
      } else {
        newEdits.push({ id, type: 'cssOverride', cssPartial });
      }
      return {
        ...state,
        edits: {
          ...state.edits,
          stencilEdits: newEdits,
        },
      };
    default:
      return state;
  }
}
