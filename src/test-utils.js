// test-utils.js
import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Router, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import PolygonGoogleMapsHOC from './components/Forms/PolygonGoogleMaps/PolygonGoogleMapsHOC';
import AuthService from './services/auth';
import configureStore from './store/configure';
import { createMemoryHistory } from 'history';
import MailoutListItem from './components/MailoutListItem';
import mailoutsData from './__mocks__/mailouts';

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
// handleBackClick()
// it('clicking "Back" menu item goes back', async () => {
//   const data = mailoutsData[0];
//   const history = createMemoryHistory();
//   history.push('/dashboard/archived');
//   history.push('/activePage');
//   render(
//     <Router history={createMemoryHistory({ initialEntries: ['/dashboard/archived'] })}>
//       <Route path="/dashboard/archived">
//         <>I am previous page</>
//       </Route>
//       <Route path="/activePage">
//         <MailoutListItem data={data} />
//       </Route>
//     </Router>
//   );

//   expect(screen.getByText('I am previous page')).not.toBeInTheDocument();
//   fireEvent.click(screen.getByRole('button', { name: 'Back' }));
//   expect(await screen.findByText('I am previous page')).toBeInTheDocument();
// });
