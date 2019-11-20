import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, compose, createStore } from 'redux';

import middleware from './middleware';
import rootReducer from './reducers';
import rootSaga from './sagas';

const configureStore = ({ initialState, AuthService }) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

  const sagaMiddleware = createSagaMiddleware();
  const enhancer = composeEnhancers(
    applyMiddleware(...middleware, sagaMiddleware)
    // other store enhancers if any
  );

  const store = createStore(rootReducer, initialState, enhancer);

  const services = { AuthService };
  let sagaTask = sagaMiddleware.run(rootSaga, services);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default;
      store.replaceReducer(nextReducer);
    });

    module.hot.accept('./sagas', () => {
      const nextSagas = require('./sagas').default;
      sagaTask.cancel();
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(nextSagas);
      });
    });
  }

  return store;
};

export default configureStore;
