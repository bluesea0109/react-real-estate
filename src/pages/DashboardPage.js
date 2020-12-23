import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useHistory } from 'react-router';
import { Progress } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import auth from '../services/auth';
import api from '../services/api';

import {
  ContentBottomHeaderLayout,
  ContentTopHeaderLayout,
  ItemBodyLayout,
  ItemLayout,
} from '../layouts';
import {
  Button,
  Header,
  Icon,
  Input,
  Menu,
  Modal,
  Message,
  Page,
  Segment,
  Snackbar,
} from '../components/Base';
import PageTitleHeader from '../components/PageTitleHeader';
import Loading from '../components/Loading';
import { calculateCost } from '../components/MailoutListItem/utils/helpers';
import { useWindowSize } from '../components/Hooks/useWindowSize';
import * as brandColors from '../components/utils/brandColors';

const SectionHeader = styled.h3`
  color: ${brandColors.grey04};
  padding-bottom: 1rem;
  padding-left: 0.5rem;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const DashboardItemContainer = styled.a`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  color: ${brandColors.grey04};
  font-weight: bold;
  cursor: pointer;
  & img {
    width: 196px;
    height: 140px;
    border-radius: 0.5rem;
    margin-bottom: 0.25rem;
  }
  &:hover {
    color: ${brandColors.grey04};
    font-weight: bold;
  }
`;

const DashboardItem = ({ className, item }) => {
  return (
    <DashboardItemContainer className={className} href="#">
      <img src="https://via.placeholder.com/400" alt="dashboard-item" />
      <span>Test item {item}</span>
    </DashboardItemContainer>
  );
};

const Dashboard = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const windowSize = useWindowSize();
  const peerId = useSelector(store => store.peer.peerId);
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
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Dashboard</Header>
            </Menu.Item>
            <Menu.Item position="right">
              <div className="right menu">
                <Button primary onClick={() => console.log('TODO - Add new project dropdown')}>
                  + New Project
                </Button>
              </div>
            </Menu.Item>
          </Menu>
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
          <DashboardItem item="test"></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem item="test"></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
          <DashboardItem></DashboardItem>
        </SectionGrid>
      </Segment>

      {error && <Snackbar error>{error}</Snackbar>}
      {/* show the loading state */}
      {false && <Loading />}
    </Page>
  );
};

export default Dashboard;
