// test-utils.js
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import PolygonGoogleMapsHOC from './components/Forms/PolygonGoogleMaps/PolygonGoogleMapsHOC';
import AuthService from './services/auth';
import configureStore from './store/configure';
import '@testing-library/jest-dom';

export function render(
  ui,
  { initialState, store = configureStore({ initialState: {}, AuthService }), ...renderOptions } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <PolygonGoogleMapsHOC>{children}</PolygonGoogleMapsHOC>
        </BrowserRouter>
      </Provider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
