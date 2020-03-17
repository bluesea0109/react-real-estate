import React, { useCallback, useEffect } from 'react';
import { Progress } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentBottomHeaderLayout, ContentTopHeaderLayout, ItemBodyLayout, ItemLayout } from '../layouts';
import { getMailoutsPending, getMoreMailoutsPending } from '../store/modules/mailouts/actions';
import { Button, Grid, Header, Icon, Menu, Page, Segment, Snackbar } from '../components/Base';
import IframeGroup from '../components/MailoutListItem/IframeGroup';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ItemList from '../components/MailoutListItem/ItemList';
import PageTitleHeader from '../components/PageTitleHeader';
import { isMobile } from '../components/utils';
import Loading from '../components/Loading';

const useFetching = (getActionCreator, onboarded, dispatch) => {
  useEffect(() => {
    // In order to prevent unnecessary call to the api when we are expecting an redirect,
    // we check for the existence of routerDestination used by the PrivatePath to route to a specific URL
    if (!localStorage.getItem('routerDestination') && onboarded) {
      dispatch(getActionCreator());
    }
  }, [getActionCreator, onboarded, dispatch]);
};

const Dashboard = () => {
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
  const mailoutsPendingState = useSelector(store => store.mailouts.pending);
  const canLoadMore = useSelector(store => store.mailouts.canLoadMore);
  const page = useSelector(store => store.mailouts.page);
  const mailoutList = useSelector(store => store.mailouts.list);
  const error = useSelector(store => store.mailouts.error?.message);

  useFetching(getMailoutsPending, onboarded, useDispatch());

  const boundFetchMoreMailouts = value => dispatch(getMoreMailoutsPending(value));

  const handleClick = e => {
    boundFetchMoreMailouts(page + 1);
  };

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
        if (!frontIframe.src) {
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

    if (mailoutItemElementArray.length > 0) {
      mailoutItemElementArray.forEach(mailoutItemElement => {
        return observer.observe(mailoutItemElement);
      });
    }
  }, [mailoutItemElementArray]);

  useEffect(() => {
    if (mailoutList.length > 0) {
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
              <Header as="h1">Dashboard</Header>
            </Menu.Item>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      {isInitiatingTeam && (
        <ContentBottomHeaderLayout style={isMobile() ? { marginTop: '60px' } : {}}>
          <Progress value={currentTeamUserCompleted} total={currentTeamUserTotal} progress="ratio" inverted success size="tiny" />
        </ContentBottomHeaderLayout>
      )}

      {isInitiatingUser && (
        <ContentBottomHeaderLayout style={isMobile() ? { marginTop: '60px' } : {}}>
          <Progress value={currentUserCompleted} total={currentUserTotal} progress="ratio" inverted success size="tiny" />
        </ContentBottomHeaderLayout>
      )}

      {!isInitiatingTeam && !isInitiatingUser && !mailoutsPendingState && mailoutList.length === 0 && (
        <ContentBottomHeaderLayout style={isMobile() ? { marginTop: '60px' } : {}}>
          <Segment placeholder style={{ marginRight: '-1em' }}>
            <Header icon>
              <Icon name="file outline" />
              No Campaigns found.
            </Header>
          </Segment>
        </ContentBottomHeaderLayout>
      )}

      {error && <Snackbar error>{error}</Snackbar>}

      {mailoutList.length > 0 && (
        <Segment style={isMobile() ? { padding: '0', paddingTop: '4.5em', marginLeft: '-1em', marginRight: '-1em' } : { marginTop: '79px' }}>
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
                      <Button id="loadMoreButton" attached="bottom" content="Load More" onClick={handleClick} onKeyPress={handleKeyPress} />
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
