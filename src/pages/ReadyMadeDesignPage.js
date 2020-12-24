import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
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
import * as brandColors from '../components/utils/brandColors';
import { Link } from 'react-router-dom';

const SectionGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  padding: 0.5rem;
`;

const ContentItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${brandColors.grey03};
  font-weight: bold;
  & img {
    width: 240px;
    height: 160px;
    padding: 0.5rem;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    box-shadow: 0 3px 8px 0 rgba(201, 201, 201, 0.4);
  }
  & .item-name {
    text-transform: capitalize;
  }
`;

const ContentItem = ({ item }) => {
  return (
    <ContentItemContainer>
      <img src={item.thumbnail} alt="content-list-item" />
      <span className="item-name">{item.name}</span>
    </ContentItemContainer>
  );
};

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
                <Link to="/dashboard">
                  <Button primary inverted>
                    Back
                  </Button>
                </Link>
              </div>
            </Menu.Item>
          </StyledMenu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      <Segment>
        <SectionHeader>All Designs (dropdown)</SectionHeader>
        <SectionGrid>
          {content.list.map(item => (
            <ContentItem key={item.id} item={item} />
          ))}
        </SectionGrid>
      </Segment>

      {error && <Snackbar error>{error}</Snackbar>}
      {content.pending && <Loading />}
    </Page>
  );
}
