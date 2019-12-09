import { GET_TEMPLATES_PENDING, GET_TEMPLATES_SUCCESS, GET_TEMPLATES_ERROR } from './actions';

const initialState = {
  pending: false,
  error: null,
  available: null,
};

export default function templates(state = initialState, action) {
  switch (action.type) {
    case GET_TEMPLATES_PENDING:
      return {
        ...state,
        pending: true,
      };

    case GET_TEMPLATES_SUCCESS:
      return {
        ...state,
        pending: false,
        available: action.payload,
      };

    case GET_TEMPLATES_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };

    default:
      return state;
  }
}
