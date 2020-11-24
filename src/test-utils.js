// test-utils.js
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import PolygonGoogleMapsHOC from './components/Forms/PolygonGoogleMaps/PolygonGoogleMapsHOC';
// Import your own reducer
import reducer from '../reducer';

function render(
  ui,
  { initialState, store = createStore(reducer, initialState), ...renderOptions } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <LastLocationProvider>
            <PolygonGoogleMapsHOC>{children}</PolygonGoogleMapsHOC>
          </LastLocationProvider>
        </BrowserRouter>
      </Provider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
