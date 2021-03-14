import React, { useState, useEffect } from 'react';

import { MainLayout, HeaderLayout, SidebarLayout, ContentLayout } from './layouts';
import TopBarContainer from './containers/TopBarContainer';
import { Navigation } from './components/Navigation/index';
import Router from './Router';
import { useLocation } from 'react-router';

function App() {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(!location.pathname.includes('/micro/listings'));
  const [showTopbar, setShowTopbar] = useState(!location.pathname.includes('/micro/listings'));

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowSidebar(!location.pathname.includes('/micro/listings'));
    setShowTopbar(!location.pathname.includes('/micro/listings'));
  }, [location]);

  return (
    <MainLayout showTopbar={showTopbar} showSidebar={showSidebar}>
      {showTopbar && (
        <HeaderLayout>
          <TopBarContainer />
        </HeaderLayout>
      )}
      {showSidebar && (
        <SidebarLayout style={{ transition: '1s', marginTop: '0px' }}>
          <Navigation />
        </SidebarLayout>
      )}
      <ContentLayout style={{ transition: '1s', marginTop: '0px' }}>
        <Router />
      </ContentLayout>
    </MainLayout>
  );
}

export default App;
