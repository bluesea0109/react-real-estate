import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';
import { BrowserRouter } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';

import 'semantic-ui-less/semantic.less';
import './reset.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'pure-react-carousel/dist/react-carousel.es.css';
import 'nouislider/distribute/nouislider.css';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configure';
import registerIcons from './registerIcons';
import AuthService from './services/auth';
import PolygonGoogleMapsHOC from './components/Forms/PolygonGoogleMaps/PolygonGoogleMapsHOC';

if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_RELEASE) {
  try {
    Sentry.init({
      dsn: 'https://3ce400284f5644d6b8612ab0213520f6@sentry.io/1887516',
      release: process.env.REACT_APP_SENTRY_RELEASE,
      integrations(integrations) {
        return integrations.filter(integration => integration.name !== 'Breadcrumbs');
      },
    });
  } catch (e) {
    console.log('Sentry initialization has failed.');
  }
}

const store = configureStore({ initialState: {}, AuthService });
registerIcons();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <LastLocationProvider>
        <PolygonGoogleMapsHOC>
          <App />
        </PolygonGoogleMapsHOC>
      </LastLocationProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
