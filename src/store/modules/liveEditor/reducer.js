import parse from 'style-to-object';
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
  SET_EDITING_PAGE,
  SET_CURRENT_STYLES,
  SET_FONT_SIZE,
  SET_TEXT_ALIGN,
  SET_FONT_WEIGHT,
  SET_FONT_STYLE,
  SET_TEXT_DECORATION,
  SET_STENCIL_EDITS,
  UPDATE_ELEMENT_CSS,
  SET_ROTATION,
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
  rotation: 0,
  selectedTemplate: true,
  editingElement: null,
  editingPage: null,
  fontSize: null,
  textAlign: null,
  fontWeight: null,
  fontStyle: null,
  textDecoration: null,
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
    case SET_ROTATION:
      return {
        ...state,
        rotation: action.payload,
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
    case SET_EDITING_PAGE:
      return {
        ...state,
        editingPage: action.payload,
      };
    case SET_CURRENT_STYLES:
      return {
        ...state,
        ...action.payload,
      };
    case SET_FONT_SIZE:
      return {
        ...state,
        fontSize: action.payload,
      };
    case SET_TEXT_ALIGN:
      return {
        ...state,
        textAlign: action.payload,
      };
    case SET_FONT_WEIGHT:
      return {
        ...state,
        fontWeight: action.payload,
      };
    case SET_FONT_STYLE:
      return {
        ...state,
        fontStyle: action.payload,
      };
    case SET_TEXT_DECORATION:
      return {
        ...state,
        textDecoration: action.payload,
      };
    case SET_STENCIL_EDITS:
      return {
        ...state,
        edits: {
          ...state.edits,
          stencilEdits: action.payload,
        },
      };
    /*
    This is the reducer to update an elements styles. Every time the stencilEdits array
    is updated the editor will run a useEffect hook to update the iframe styles in real time.
    Payload takes a css property (string) and value (string)
    */
    case UPDATE_ELEMENT_CSS:
      const { editingElement, editingPage } = state;
      if (!editingElement || !editingPage) return;
      const { property, value } = action.payload;
      // get the index of the element being edited in the stencilEdits array
      let newEdits = [...state.edits.stencilEdits];
      const elementIndex = newEdits.findIndex(
        el => el.id === editingElement && el.page === editingPage
      );
      if (elementIndex !== -1) {
        // found an existing entry parse the css edit and save
        let cssString = newEdits[elementIndex].cssPartial?.match(/\{(.*?)\}/)[1];
        let styleObject = parse(cssString);
        styleObject[property] = value;
        cssString = Object.entries(styleObject)
          .map(([property, value]) => `${property}:${value}`)
          .join(';');
        const cssPartial = `#${editingElement}{${cssString}}`;
        newEdits[elementIndex].cssPartial = cssPartial;
      } else {
        // no edits found, push the edit as the first entry
        const cssPartial = `#${editingElement}{${property}:${value}}`;
        newEdits.push({ id: editingElement, page: editingPage, type: 'cssOverride', cssPartial });
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
