import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { MainLayout, HeaderLayout, SidebarLayout, ContentLayout } from './layouts';
import TopBarContainer from './containers/TopBarContainer';
import { Navigation } from './components/Navigation/index';
import Router from './Router';

function App() {
  const showBars = useSelector(store => store.auth0.showBars);

  const [showSidebar, setShowSidebar] = useState(false);
  const [showTopbar, setShowTopbar] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (showBars.indexOf('showTopbar') >= 0) {
      setShowTopbar(true);
    } else {
      setShowTopbar(false);
    }
    if (showBars.indexOf('showSidebar') >= 0) {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
    }
  }, [showBars]);

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
      <ContentLayout showSidebar={showSidebar} style={{ marginTop: '0px' }}>
        <Router />
      </ContentLayout>
    </MainLayout>
  );
}

export default App;
