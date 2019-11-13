import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import toDoApp from './store/reducers';

// Reset CSS
import './reset.css';
// Add Semantic-UI CSS
import 'semantic-ui-css/semantic.min.css';
// Add Global CSS
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

const store = createStore(toDoApp);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
