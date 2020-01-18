import * as Sentry from '@sentry/browser';

const sentryHandler = (store, action, err) => {
  const state = store.getState();

  if (err) {
    Sentry.captureException(new Error('Exception Error'));
    Sentry.setExtra('details', err);
  } else {
    Sentry.captureException(new Error('API Return Error'));
  }

  if (action.type) Sentry.setExtra('type', action.type);
  if (action.error) Sentry.setExtra('error', action.error);
  if (state.onLogin.mode) Sentry.setExtra('mode', state.onLogin.mode);
  if (state.onLogin.permissions) Sentry.setExtra('permissions', state.onLogin.permissions);
  if (state.onLogin.user) Sentry.setExtra('user', state.onLogin.user);
  if (state.onLogin.userBranding) Sentry.setExtra('userBranding', state.onLogin.userBranding);
  if (state.onLogin.userProfile) Sentry.setExtra('userProfile', state.onLogin.userProfile);
  if (state.onLogin.teamBranding) Sentry.setExtra('teamBranding', state.onLogin.teamBranding);
  if (state.onLogin.teamProfile) Sentry.setExtra('teamProfile', state.onLogin.teamProfile);
};

const crashReporter = store => next => action => {
  // TODO: Fix shortcode erros and remove `&& !action.type.includes('_SHORTCODE_')`
  if (action.type.includes('_ERROR') && !action.type.includes('_SHORTCODE_')) {
    sentryHandler(store, action);
  }

  return next(action);

  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    sentryHandler(store, action, err);
    throw err;
  }
};

export default crashReporter;
