import React, { useEffect, useState } from 'react';

import { MainLayout, HeaderLayout, SidebarLayout, ContentLayout } from './layouts';
import TopBarContainer from './containers/TopBarContainer';
import { Navigation } from './components/Navigation/index';
import Router from './Router';
import { useLocation } from 'react-router';

function App() {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(!location.pathname.includes('/postcards/editor/'));

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowSidebar(!location.pathname.includes('/postcards/editor/'));
  }, [location]);

  return (
    <MainLayout showSidebar={showSidebar}>
      <HeaderLayout>
        <TopBarContainer />
      </HeaderLayout>
      {showSidebar && (
        <SidebarLayout style={{ transition: '1s', marginTop: '0px' }}>
          <Navigation />
        </SidebarLayout>
      )}
      <ContentLayout showSidebar={showSidebar} style={{ marginTop: '0px' }}>
        <Router />
      </ContentLayout>
    </MainLayout>
  );
}

export default App;
