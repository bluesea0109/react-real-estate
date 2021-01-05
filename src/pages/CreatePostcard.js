import React from 'react';
import styled from 'styled-components';
import { Button, Header, Menu, Page, Segment, StyledMenu, Tab } from '../components/Base';
import PageTitleHeader from '../components/PageTitleHeader';
import { ContentTopHeaderLayout } from '../layouts';

const TemplatesTab = () => {
  return (
    <>
      <p>Select a size</p>
      <div>Sizes here...</div>
      <p>All Templates (dropdown - filter)</p>
      <div>Templates here...</div>
    </>
  );
};

const CustomTab = () => {
  return <div>Custom Tab</div>;
};

const panes = [
  {
    menuItem: 'Templates',
    render: () => (
      <Tab.Pane as="div">
        <TemplatesTab />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Custom Design',
    render: () => (
      <Tab.Pane as="div">
        <CustomTab />
      </Tab.Pane>
    ),
  },
];

const StyledTab = styled(Tab)`
  &&&& {
    .ui.menu {
      margin-top: 0;
    }
  }
`;

export default function CreatePostcard(props) {
  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <StyledMenu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Create Postcard Campaign</Header>
            </Menu.Item>
            <Menu.Item position="right">
              <div className="right menu">
                <Button onClick={() => console.log('TODO - Back to dashboard?')}>Cancel</Button>
                <Button primary onClick={() => console.log('TODO - Create...')}>
                  Create
                </Button>
              </div>
            </Menu.Item>
          </StyledMenu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>
      <Segment>
        <StyledTab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Segment>
    </Page>
  );
}
