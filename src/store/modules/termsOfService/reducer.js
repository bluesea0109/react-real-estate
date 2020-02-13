import { TERMS_OF_SERVICE_PENDING, TERMS_OF_SERVICE_ACCEPTED, TERMS_OF_SERVICE_REJECTED } from './actions';

const initialState = {
  pending: false,
  accepted: null,
  rejected: null,
};

export default function termsOfService(state = initialState, action) {
  switch (action.type) {
    case TERMS_OF_SERVICE_PENDING:
      return {
        ...state,
        pending: true,
        accepted: null,
        rejected: null,
      };

    case TERMS_OF_SERVICE_ACCEPTED:
      return {
        ...state,
        pending: false,
        accepted: true,
      };

    case TERMS_OF_SERVICE_REJECTED:
      return {
        ...state,
        pending: false,
        rejected: true,
      };

    default:
      return state;
  }
}
