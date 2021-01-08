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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const DashboardItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  & img {
    width: 196px;
    height: 140px;
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
            linkTo={{ pathname: 'create-postcard', state: { filter: 'just-listed' } }}
          ></DashboardItem>
          <DashboardItem
            name="just sold postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'just-sold' } }}
          ></DashboardItem>
          <DashboardItem
            name="handwritten postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'handwritten' } }}
          ></DashboardItem>
          <DashboardItem
            name="holiday postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'holiday' } }}
          ></DashboardItem>
          <DashboardItem
            name="custom postcard"
            linkTo={{ pathname: 'create-postcard', state: { filter: 'custom' } }}
          ></DashboardItem>
          <DashboardItem name="just listed ad" linkTo="#"></DashboardItem>
          <DashboardItem name="just sold ad" linkTo="#"></DashboardItem>
          <DashboardItem name="open house ad" linkTo="#"></DashboardItem>
          <DashboardItem name="home value ad" linkTo="#"></DashboardItem>
          <DashboardItem name="buyer search ad" linkTo="#"></DashboardItem>
          <DashboardItem
            name="business card"
            linkTo="https://brandco.com/business-cards/"
            external
          ></DashboardItem>
          <DashboardItem
            name="kwkly sign"
            linkTo="https://brandco.com/custom-print/"
            external
          ></DashboardItem>
          <DashboardItem
            name="listing sign"
            linkTo="https://brandco.com/custom-print/"
            external
          ></DashboardItem>
          <DashboardItem
            name="sign rider"
            linkTo="https://brandco.com/custom-print/"
            external
          ></DashboardItem>
          <DashboardItem
            name="name tag"
            linkTo="https://brandco.com/custom-print/"
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
