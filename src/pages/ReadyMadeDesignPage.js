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

const SectionGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const ContentItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
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
  const testItems = () => {
    let items = [];
    for (let i = 0; i < 20; i++) items.push(content.list[0]);
    return items;
  };
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
          {testItems().map((item, index) => (
            <ContentItem key={item.id + index} item={item} />
          ))}
          {/* {content.list.map(item => (
            <ContentItem key={item.id} item={item} />
          ))} */}
        </SectionGrid>
      </Segment>

      {error && <Snackbar error>{error}</Snackbar>}
      {content.pending && <Loading />}
    </Page>
  );
}
