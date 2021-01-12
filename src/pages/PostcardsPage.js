import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';

import { Progress } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import {
  ContentBottomHeaderLayout,
  ContentTopHeaderLayout,
  ItemBodyLayout,
  ItemLayout,
} from '../layouts';
import {
  getMailoutsPending,
  getMoreMailoutsPending,
  clearNewHolidayId,
} from '../store/modules/mailouts/actions';
import { setCompletedDashboardModal } from '../store/modules/onboarded/actions';
import {
  Button,
  Grid,
  Header,
  Icon,
  Menu,
  Modal,
  Page,
  Segment,
  Snackbar,
} from '../components/Base';
import IframeGroup from '../components/MailoutListItem/IframeGroup';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ItemList from '../components/MailoutListItem/ItemList';
import PageTitleHeader from '../components/PageTitleHeader';
import Loading from '../components/Loading';
import { useIsMobile } from '../components/Hooks/useIsMobile';
import Styled from 'styled-components';

const ModalWelcome = Styled(Modal)`
&&&{
  width:70%
}
@media only screen and (max-width: 800px) {
  &&&{
    width:90%;
  }
}
`;

const modalHeaderStyles = {
  padding: '4px 0px 0px 0px',
  display: 'flex',
  fontSize: '29px',
  color: '#59c4c4',
  fontWeight: '400',
  justifyContent: 'space-between',
  borderBottom: 'none',
};

const useFetching = (getActionCreator, onboarded, dispatch) => {
  useEffect(() => {
    // In order to prevent unnecessary call to the api when we are expecting a redirect,
    // we check for the existence of routerDestination used by the PrivatePath to route to a specific URL
    if (!localStorage.getItem('routerDestination') && onboarded) {
      dispatch(getActionCreator());
    }
  }, [getActionCreator, onboarded, dispatch]);
};

const Dashboard = () => {
  const isMobile = useIsMobile();
  const history = useHistory();
  const dispatch = useDispatch();

  const isInitiatingTeam = useSelector(store => store.teamInitialize.polling);
  const initiatingTeamState = useSelector(store => store.teamInitialize.available);
  const currentTeamUserTotal = initiatingTeamState && initiatingTeamState.currentUserTotal;
  const currentTeamUserCompleted = initiatingTeamState && initiatingTeamState.currentUserCompleted;

  const isInitiatingUser = useSelector(store => store.initialize.polling);
  const initiatingUserState = useSelector(store => store.initialize.available);
  const currentUserTotal = initiatingUserState && initiatingUserState.campaignsTotal;
  const currentUserCompleted = initiatingUserState && initiatingUserState.campaignsCompleted;

  const onboarded = useSelector(store => store.onboarded.status);
  const seenDashboardModel =
    useSelector(store => store.onboarded.seenDashboardModel) ||
    localStorage.getItem('seenDashboardModel');
  const mailoutsPendingState = useSelector(store => store.mailouts.pending);
  const addCampaignMlsNumPendingState = useSelector(
    store => store.mailouts.addCampaignMlsNumPending
  );
  const canLoadMore = useSelector(store => store.mailouts.canLoadMore);
  const page = useSelector(store => store.mailouts.page);
  const mailoutList = useSelector(store => store.mailouts.list);
  const error = useSelector(store => store.mailouts.error?.message);

  const holidayCampaignId = useSelector(store => store.mailouts?.newHolidayId);

  useFetching(getMailoutsPending, onboarded, useDispatch());

  const boundFetchMoreMailouts = value => dispatch(getMoreMailoutsPending(value));

  const dismissDashboardExplanation = value => dispatch(setCompletedDashboardModal(value));

  const handleClick = e => {
    boundFetchMoreMailouts(page + 1);
  };

  useEffect(() => {
    if (holidayCampaignId) {
      history.push(`/dashboard/edit/${holidayCampaignId}/destinations`);
      dispatch(clearNewHolidayId());
    }
  }, [holidayCampaignId, history, dispatch]);

  const handleKeyPress = e => {
    // Prevent the default action to stop scrolling when space is pressed
    e.preventDefault();
    boundFetchMoreMailouts(page + 1);
  };

  const mailoutItemElementArray = [];

  function handleIntersect(entries, observer) {
    entries.forEach((entry, index) => {
      const frontIframe = entry.target.querySelector('#bm-iframe-front');
      const backIframe = entry.target.querySelector('#bm-iframe-back');

      if (entry.isIntersecting) {
        if (frontIframe && !frontIframe.src) {
          frontIframe.src = frontIframe.title;
        }
        if (!backIframe.src) {
          backIframe.src = backIframe.title;
        }
      }
    });
  }

  const createObserver = useCallback(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    if (mailoutItemElementArray && mailoutItemElementArray.length > 0) {
      mailoutItemElementArray.forEach(mailoutItemElement => {
        return observer.observe(mailoutItemElement);
      });
    }
  }, [mailoutItemElementArray]);

  useEffect(() => {
    if (mailoutList && mailoutList.length > 0) {
      mailoutList.map((item, index) => {
        const mailoutItemElement = document.querySelector(`#mailout-iframe-set-${index}`);

        return mailoutItemElementArray.push(mailoutItemElement);
      });

      createObserver();
    }
  }, [mailoutList, mailoutItemElementArray, createObserver]);

  const MailoutsList = ({ list }) => {
    if (list[0].started) return null;

    return list.map((item, index) => (
      <ItemLayout fluid key={`${item.userId}-${item._id}-${item.mlsNum}`}>
        <ListHeader data={item} />
        <ItemBodyLayout attached style={{ padding: 10 }}>
          <IframeGroup index={index} item={item} linkTo={`dashboard/${item._id}`} />
          <ItemList data={item} />
          {item.cta && (
            <div className="customPostcardCTA">
              Custom CTA:{' '}
              <a href={item.cta} target="blank">
                {item.cta}
              </a>
            </div>
          )}
        </ItemBodyLayout>
      </ItemLayout>
    ));
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Postcards</Header>
            </Menu.Item>
            <Menu.Item position="right">
              <div className="right menu">
                {addCampaignMlsNumPendingState && (
                  <Button loading primary>
                    Add Campaign
                  </Button>
                )}
                {!addCampaignMlsNumPendingState && (
                  <Button
                    primary
                    onClick={() => history.push('create-postcard', { from: 'postcards' })}
                  >
                    Add Campaign
                  </Button>
                )}
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

      {!isInitiatingTeam &&
        !isInitiatingUser &&
        !mailoutsPendingState &&
        mailoutList &&
        mailoutList.length === 0 && (
          <ContentBottomHeaderLayout>
            <Segment placeholder style={{ marginRight: '-1em' }}>
              <Header icon>
                <Icon name="file outline" />
                No Campaigns found.
              </Header>
            </Segment>
          </ContentBottomHeaderLayout>
        )}

      {error && <Snackbar error>{error}</Snackbar>}

      {mailoutList && mailoutList.length > 0 && (
        <Segment
          style={
            isMobile
              ? { padding: '0', paddingTop: '4.5em', marginLeft: '-1em', marginRight: '-1em' }
              : { marginTop: '22px' }
          }
        >
          <ModalWelcome open={!seenDashboardModel} size="small">
            <ModalWelcome.Header style={modalHeaderStyles}>
              Welcome to your postcards dashboard!
            </ModalWelcome.Header>
            <ModalWelcome.Content
              style={{ color: '#686868', fontSize: '16px', padding: '30px 0px' }}
            >
              <p>
                We have generated some initial campaigns for you! Please note, when you initially
                sign up, you may not see all listings due to:
              </p>
              <ul style={{ lineHeight: '30px' }}>
                <li>Listings older than 6 months are not included</li>
                <li>We only show a maximum of 15 previous listings from the past</li>
                <li>
                  For some boards, sold listings wont show up yet. But upcoming sold listings will
                  create new campaigns
                </li>
                <li>
                  We exclude listing types (e.g. commercial/land) and locations (e.g. rural
                  locations) that are difficult for our system to target
                </li>
                <li>
                  We find your listings based on the MLS board/agent id in the Profile section of
                  each user. Modifying agent ids will adjust this list
                </li>
              </ul>
            </ModalWelcome.Content>
            <ModalWelcome.Actions style={{ borderTop: 'none', padding: '0px' }}>
              <Button primary onClick={dismissDashboardExplanation}>
                <Icon name="checkmark" /> Ok
              </Button>
            </ModalWelcome.Actions>
          </ModalWelcome>

          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <MailoutsList list={mailoutList} />
              </Grid.Column>
            </Grid.Row>

            {(isInitiatingTeam || isInitiatingUser || mailoutsPendingState) && (
              <Grid.Row>
                <Grid.Column width={16}>
                  <Loading />
                </Grid.Column>
              </Grid.Row>
            )}

            {canLoadMore && (
              <Grid.Row>
                <Grid.Column width={16}>
                  <Grid centered columns={2}>
                    <Grid.Column>
                      <Button
                        id="loadMoreButton"
                        attached="bottom"
                        content="Load More"
                        onClick={handleClick}
                        onKeyPress={handleKeyPress}
                      />
                    </Grid.Column>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            )}
          </Grid>
        </Segment>
      )}
      {mailoutsPendingState && !error && <Loading />}
    </Page>
  );
};

export default Dashboard;
