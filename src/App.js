import React, { useEffect, useState } from 'react';

import { MainLayout, HeaderLayout, SidebarLayout, ContentLayout } from './layouts';
import TopBarContainer from './containers/TopBarContainer';
import Navigation from './components/Navigation';
import Router from './Router';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';

function App() {
  const location = useLocation();
  const showAlert = useSelector(store => store.ui.showAlert);
  const [alert, setAlert] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!showAlert) {
      setAlert(showAlert);
    }
  }, [location, showAlert, setAlert]);

  return (
    <MainLayout>
      <HeaderLayout>
        <TopBarContainer />
      </HeaderLayout>
      <SidebarLayout style={alert ? { marginTop: '39px' } : { transition: '1s', marginTop: '0px' }}>
        <Navigation />
      </SidebarLayout>
      <ContentLayout style={alert ? { marginTop: '39px' } : { transition: '1s', marginTop: '0px' }}>
        <Router />
      </ContentLayout>
    </MainLayout>
  );
}

export default App;
