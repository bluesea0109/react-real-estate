import React, { useEffect } from 'react';

import { MainLayout, HeaderLayout, SidebarLayout, ContentLayout } from './layouts';
import TopBarContainer from './containers/TopBarContainer';
import Navigation from './components/Navigation';
import Router from './Router';
import { useLocation } from 'react-router';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <MainLayout>
      <HeaderLayout>
        <TopBarContainer />
      </HeaderLayout>
      <SidebarLayout style={{ transition: '1s', marginTop: '0px' }}>
        <Navigation />
      </SidebarLayout>
      <ContentLayout style={{ transition: '1s', marginTop: '0px' }}>
        <Router />
      </ContentLayout>
    </MainLayout>
  );
}

export default App;
