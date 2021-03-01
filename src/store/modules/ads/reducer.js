import { GET_ADS_TOOL_PENDING, GET_ADS_TOOL_SUCCESS, GET_ADS_TOOL_ERROR } from './actions';

const initialState = {
  pending: false,
  adsTool: null,
  error: null,
};

export default function mailout(state = initialState, action) {
  switch (action.type) {
    case GET_ADS_TOOL_PENDING:
      return {
        ...state,
        pending: true,
        error: null,
      };

    case GET_ADS_TOOL_SUCCESS:
      console.log('succcccccces', action.payload);
      return {
        ...state,
        pending: false,
        adsTool: action.payload,
        error: null,
      };

    case GET_ADS_TOOL_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
