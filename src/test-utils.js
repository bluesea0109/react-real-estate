// test-utils.js
import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Router, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import PolygonGoogleMapsHOC from './components/Forms/PolygonGoogleMaps/PolygonGoogleMapsHOC';
import AuthService from './services/auth';
import configureStore from './store/configure';
import { createMemoryHistory } from 'history';
import MailoutDetailsPage from './pages/MailoutDetailsPage';
import mailoutsData from './__mocks__/mailouts';
import DashboardPage from './pages/DashboardPage';
import '@testing-library/jest-dom';
import MemoryRouter from 'react-router-dom';
export function render(
  ui,
  { initialState, store = configureStore({ initialState: {}, AuthService }), ...renderOptions } = {}
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

// // re-export everything
// export * from '@testing-library/react';
// // override render method
// export { render };
//handleBackClick();

// it('clicking "Back" menu item goes back', async () => {
//   const history = createMemoryHistory();
//   history.push('/dashboard');
//   history.push('/activePage');
//   render(
//     <Router history={createMemoryHistory({ initialEntries: [`/dashboard/activePage`] })}>
//       <Route path="/dashboard">
//         <DashboardPage />
//       </Route>
//       <Route path="/activePage">
//         <MailoutDetailsPage />
//       </Route>
//     </Router>
//   );

//   expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
//   fireEvent.click(screen.getByRole('button', { name: 'Back' }));
//   expect(await screen.queryByText('Dashboard')).toBeInTheDocument();
// });
