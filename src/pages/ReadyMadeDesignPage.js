import React from 'react';
import styled from 'styled-components';
import { ContentTopHeaderLayout } from '../layouts';
import {
  Button,
  Header,
  Menu,
  Page,
  Segment,
  Snackbar,
  SectionHeader,
  StyledMenu,
} from '../components/Base';
import PageTitleHeader from '../components/PageTitleHeader';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

export default function ReadyMadeDesignPage() {
  const error = false;
  const content = useSelector(store => store.content);
  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <StyledMenu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Ready Made Designs</Header>
            </Menu.Item>
            <Menu.Item position="right">
              <div className="right menu">
                <Button primary inverted onClick={() => console.log('TODO - Back Button')}>
                  Back
                </Button>
              </div>
            </Menu.Item>
          </StyledMenu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      <Segment>
        <SectionHeader>All Designs (dropdown)</SectionHeader>
        <SectionGrid>
          <img src={content.list[0].thumbnail} alt="content-list-item" />
        </SectionGrid>
      </Segment>

      {error && <Snackbar error>{error}</Snackbar>}
      {content.pending && <Loading />}
    </Page>
  );
}
