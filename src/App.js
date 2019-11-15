import React from 'react';

import { MainLayout, HeaderLayout, SidebarLayout, ContentLayout } from './layouts';
import TopBarContainer from './containers/TopBarContainer';
import Navigation from './components/Navigation';
import Router from './Router';

function App() {
  return (
    <MainLayout>
      <HeaderLayout>
        <TopBarContainer />
      </HeaderLayout>
      <SidebarLayout>
        <Navigation />
      </SidebarLayout>
      <ContentLayout>
        <Router />
      </ContentLayout>
    </MainLayout>
  );
}

export default App;
