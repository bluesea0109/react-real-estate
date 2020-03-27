import * as Sentry from '@sentry/browser';

const sentryHandler = (store, action, err) => {
  try {
    const state = store.getState();

    if (action.type) Sentry.setExtra('type', action.type);
    if (action.error) Sentry.setExtra('error', action.error);
    if (state.onLogin?.mode) Sentry.setExtra('mode', state.onLogin.mode);
    if (state.onLogin?.permissions) Sentry.setExtra('permissions', state.onLogin.permissions);
    if (state.onLogin?.user) Sentry.setExtra('user', state.onLogin.user);
    if (state.onLogin?.userBranding) Sentry.setExtra('userBranding', state.onLogin.userBranding);
    if (state.onLogin?.userProfile) Sentry.setExtra('userProfile', state.onLogin.userProfile);
    if (state.onLogin?.teamBranding) Sentry.setExtra('teamBranding', state.onLogin.teamBranding);
    if (state.onLogin?.teamProfile) Sentry.setExtra('teamProfile', state.onLogin.teamProfile);

    if (err) {
      Sentry.captureException(new Error(err.message));
    } else {
      if (action.error?.statusCode !== 412 && action.error?.statusCode !== 410 && action.error?.statusCode !== 404) {
        Sentry.captureException(new Error(action.error?.message));
      }
    }
  } catch (err) {
    console.log('Sentry not initialized');
  }
};

const crashReporter = store => next => action => {
  if (action.type.includes('_ERROR') && !action.type.includes('_SHORTCODE_')) {
    sentryHandler(store, action);
  }

  try {
    return next(action);
  } catch (err) {
    sentryHandler(store, action, err);
    throw err;
  }
};

export default crashReporter;
