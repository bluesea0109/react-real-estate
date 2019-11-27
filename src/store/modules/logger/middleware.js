import { createLogger } from 'redux-logger';

export default createLogger({
  collapsed: true,

  // only log in development mode and ignore `CHANGE_FORM` actions in the logger, since they fire after every keystroke
  predicate: (getState, action) =>
    process.env.NODE_ENV === 'development' &&
    action.type !== '@@redux-form/CHANGE' &&
    action.type !== '@@redux-form/REGISTER_FIELD' &&
    action.type !== '@@redux-form/UNREGISTER_FIELD',
});
