import { createLogger } from 'redux-logger';

export default createLogger({
  collapsed: true,
  diff: true,

  // predicate: (/*getState, action*/) => process.env.NODE_ENV === 'development',
});
