import React from 'react';
import { Progress } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { ContentBottomHeaderLayout, ContentTopHeaderLayout } from '../layouts';
import {
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
  gap: 0.5rem;
  grid-template-columns: repeat(5, minmax(220px, 1fr));
  @media (max-width: 1260px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
`;

const DashboardItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  & img {
    width: 220px;
    height: 160px;
    border-radius: 6px;
    margin-bottom: 0.25rem;
    box-shadow: 0 3px 8px 0 rgba(201, 201, 201, 0.4);
  }
  & .item-name {
    color: ${brandColors.grey04};
    text-transform: capitalize;
    & .kwkly-code {
      text-transform: uppercase;
    }
  }
  &:hover {
    color: ${brandColors.grey04};
    font-weight: bold;
  }
`;

const getDashboardImg = fileName =>
  `https://stencil-alf-assets.s3.amazonaws.com/marketer/${fileName}`;

const DashboardItem = ({ className, name, linkTo, external }) => {
  let imgFileName = `${name.replaceAll(' ', '_')}.jpg`;
  let imgSrc = getDashboardImg(`${imgFileName}`);
  const linkAttributes = external
    ? {
        href: linkTo,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};
  if (external) {
    return (
      <DashboardItemContainer className={className}>
        <a {...linkAttributes}>
          <img src={imgSrc} alt={`dashboard-item-${name}`} />
          <span className="item-name">
            {name === 'kwkly sign' ? (
              <>
                <span className="kwkly-code">KWKLY </span>
                <span>Sign</span>
              </>
            ) : (
              name
            )}
          </span>
        </a>
      </DashboardItemContainer>
    );
  }
  return (
    <DashboardItemContainer className={className}>
      <Link to={linkTo}>
        <img src={imgSrc} alt={`dashboard-item-${name}`} />
        <span className="item-name">{name}</span>
      </Link>
    </DashboardItemContainer>
  );
};

const Dashboard = () => {
  const isInitiatingTeam = useSelector(store => store.teamInitialize.polling);
  const initiatingTeamState = useSelector(store => store.teamInitialize.available);
  const currentTeamUserTotal = initiatingTeamState && initiatingTeamState.currentUserTotal;
  const currentTeamUserCompleted = initiatingTeamState && initiatingTeamState.currentUserCompleted;
  const isInitiatingUser = useSelector(store => store.initialize.polling);
  const initiatingUserState = useSelector(store => store.initialize.available);
  const currentUserTotal = initiatingUserState && initiatingUserState.campaignsTotal;
  const currentUserCompleted = initiatingUserState && initiatingUserState.campaignsCompleted;

  const error = useSelector(store => store.mailouts.error?.message);

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <StyledMenu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Dashboard</Header>
            </Menu.Item>
          </StyledMenu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      {isInitiatingTeam && (
        <ContentBottomHeaderLayout>
          <Progress
            value={currentTeamUserCompleted}
            total={currentTeamUserTotal}
            progress="ratio"
            inverted
            success
            size="tiny"
          />
        </ContentBottomHeaderLayout>
      )}

      {isInitiatingUser && (
        <ContentBottomHeaderLayout>
          <Progress
            value={currentUserCompleted}
            total={currentUserTotal}
            progress="ratio"
            inverted
            success
            size="tiny"
          />
        </ContentBottomHeaderLayout>
      )}

      <Segment>
        <SectionHeader>What do you want to create?</SectionHeader>
        <SectionGrid>
          <DashboardItem
            name="just listed postcard"
            linkTo={{
              pathname: 'create-postcard',
              state: { filter: 'Just Listed' },
            }}
          ></DashboardItem>
          <DashboardItem
            name="just sold postcard"
            linkTo={{
              pathname: 'create-postcard',
              state: { filter: 'Just Sold' },
            }}
          ></DashboardItem>
          <DashboardItem
            name="handwritten postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'Handwritten' } }}
          ></DashboardItem>
          <DashboardItem
            name="holiday postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'Holiday' } }}
          ></DashboardItem>
          <DashboardItem
            name="custom postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'custom' } }}
          ></DashboardItem>
          <DashboardItem name="just listed ad" linkTo="listings"></DashboardItem>
          <DashboardItem name="just sold ad" linkTo="listings"></DashboardItem>
          <DashboardItem name="open house ad" linkTo="listings"></DashboardItem>
          <DashboardItem name="home value ad" linkTo="listings"></DashboardItem>
          <DashboardItem name="buyer search ad" linkTo="listings"></DashboardItem>
          <DashboardItem
            name="business card"
            linkTo="https://agentstore.com/product-category/business-cards/"
            external
          ></DashboardItem>
          <DashboardItem
            name="kwkly sign"
            linkTo="https://agentstore.com/kwkly"
            external
          ></DashboardItem>
          <DashboardItem
            name="listing sign"
            linkTo="https://agentstore.com/product-category/signs/"
            external
          ></DashboardItem>
          <DashboardItem
            name="sign rider"
            linkTo="https://agentstore.com/product/3mm-pvc-sign-riders-18-x-6-3-pack/"
            external
          ></DashboardItem>
          <DashboardItem
            name="name tag"
            linkTo="https://agentstore.com/product-category/name-tags/"
            external
          ></DashboardItem>
        </SectionGrid>
      </Segment>

      <PageTitleHeader>
        <StyledMenu borderless fluid secondary>
          <Menu.Item>
            <Link to="/ready-made-designs">
              <Header as="h2" className="secondary-heading">
                Ready made designs - Click Here!
              </Header>
            </Link>
          </Menu.Item>
        </StyledMenu>
      </PageTitleHeader>

      {error && <Snackbar error>{error}</Snackbar>}
      {/* show the loading state */}
      {false && <Loading />}
    </Page>
  );
};

export default Dashboard;
