import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchMailoutsPending, fetchMoreMailoutsPending } from '../store/modules/mailouts/actions';
import { Button, Header, Grid, Menu, Message, Page, Segment } from '../components/Base';
import { MobileDisabledLayout, MobileEnabledLayout } from '../layouts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MailoutListItem from '../components/MailoutListItem';
import EmptyItem from '../components/EmptyItem';
import Loading from '../components/Loading';

const useFetching = (fetchActionCreator, dispatch) => {
  useEffect(() => {
    // In order to prevent unnecessary call to the api when we are expecting an redirect,
    // we check for the existence of routerDestination used by the PrivatePath to route to a specific URL
    if (!localStorage.getItem('routerDestination')) {
      dispatch(fetchActionCreator());
    }
  }, [fetchActionCreator, dispatch]);
};

const Dashboard = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(store => store.mailouts.pending);
  const canLoadMore = useSelector(store => store.mailouts.canLoadMore);
  const page = useSelector(store => store.mailouts.page);
  const list = useSelector(store => store.mailouts.list);
  const error = useSelector(store => store.mailouts.error);

  useFetching(fetchMailoutsPending, useDispatch());

  const boundRefetch = () => dispatch(fetchMailoutsPending());

  const boundFetchMoreMailouts = value => dispatch(fetchMoreMailoutsPending(value));

  const handleClick = e => {
    boundFetchMoreMailouts(page + 1);
  };

  const handleKeyPress = e => {
    // Prevent the default action to stop scrolling when space is pressed
    e.preventDefault();
    boundFetchMoreMailouts(page + 1);
  };

  return (
    <Page basic>
      <Segment>
        <Grid>
          <Grid.Row>
            <Menu borderless fluid secondary>
              <Menu.Item>
                <Header as="h3">Dashboard</Header>
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  <Button basic color="teal" onClick={() => boundRefetch()}>
                    <MobileDisabledLayout>
                      Get My Properties <FontAwesomeIcon icon="sync-alt" style={{ marginLeft: '.5em' }} />
                    </MobileDisabledLayout>
                    <MobileEnabledLayout>
                      <FontAwesomeIcon icon="sync-alt" />
                    </MobileEnabledLayout>
                  </Button>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Grid.Row>

          {!isLoading && !error && list.length > 0 && (
            <Grid.Row>
              <Grid.Column width={16}>{list.map(item => MailoutListItem(item))}</Grid.Column>
            </Grid.Row>
          )}

          {!isLoading && !error && list.length > 0 && canLoadMore && (
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

          {!isLoading && !error && list.length === 0 && (
            <Grid.Row>
              <Grid.Column width={16}>
                <EmptyItem />
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Segment>
      {isLoading && !error && Loading()}
      {error && <Message error>Oh snap! {error}.</Message>}
    </Page>
  );
};

export default Dashboard;
