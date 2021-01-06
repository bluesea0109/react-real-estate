import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Header, Menu, Page, Segment, StyledMenu, Tab } from '../../components/Base';
import PageTitleHeader from '../../components/PageTitleHeader';
import { ContentTopHeaderLayout } from '../../layouts';
import GridItem from './GridItem';
import GridLayout from './GridLayout';
import PostcardSizes from './PostcardSizes';
import TemplatesGrid from './TemplatesGrid';

const TemplatesTab = ({ templates }) => {
  return (
    <>
      <p>Select a size</p>
      <PostcardSizes />
      <p>All Templates (dropdown - filter)</p>
      <TemplatesGrid templates={templates} />
    </>
  );
};

const CustomTab = () => {
  return (
    <>
      <p>Select a size</p>
      <PostcardSizes />
      <p>Card Front</p>
      <GridLayout>
        <GridItem>Upload</GridItem>
      </GridLayout>
    </>
  );
};

const StyledTab = styled(Tab)`
  &&&& {
    padding: 0 1rem;
    .ui.menu {
      margin-top: 0;
    }
  }
`;

export default function CreatePostcard(props) {
  const allTemplates = Object.values(useSelector(state => state.templates.available)).reduce(
    (acc, cur) => [...acc, ...cur],
    []
  );

  const panes = [
    {
      menuItem: 'Templates',
      render: () => (
        <Tab.Pane as="div">
          <TemplatesTab templates={allTemplates} />
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
