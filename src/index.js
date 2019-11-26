import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import './reset.css';
import 'semantic-ui-css/semantic.min.css';
import 'pure-react-carousel/dist/react-carousel.es.css';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configure';
import registerIcons from './registerIcons';
import AuthService from './services/auth';

const store = configureStore({ initialState: {}, AuthService });
registerIcons();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
