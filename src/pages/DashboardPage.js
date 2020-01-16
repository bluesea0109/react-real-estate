import React, { useEffect } from 'react';
import { Progress } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { ContentBottomHeaderLayout, ContentTopHeaderLayout, ItemBodyLayout, ItemLayout } from '../layouts';
import { Button, Header, Grid, Menu, /*Message,*/ Page, Segment, Icon } from '../components/Base';
import { getMailoutsPending, getMoreMailoutsPending } from '../store/modules/mailouts/actions';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ImageGroup from '../components/MailoutListItem/ImageGroup';
import ItemList from '../components/MailoutListItem/ItemList';
import { isMobile } from '../components/Forms/helpers';
import Loading from '../components/Loading';
import './DashboardPage.css';

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
  const isInitiating = useSelector(store => store.initialize.polling);
  const initiatingState = useSelector(store => store.initialize.available);
  const currentUserTotal = initiatingState && initiatingState.currentUserTotal;
  const currentUserCompleted = initiatingState && initiatingState.currentUserCompleted;

  const onboarded = useSelector(store => store.onboarded.status);
  const mailoutsPendingState = useSelector(store => store.mailouts.pending);
  const canLoadMore = useSelector(store => store.mailouts.canLoadMore);
  const page = useSelector(store => store.mailouts.page);
  const mailoutList = useSelector(store => store.mailouts.list);
  // const error = useSelector(store => store.mailouts.error);

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

  const MailoutsList = ({ list }) => {
    if (list[0].started) return null;

    return list.map(item => (
      <ItemLayout fluid key={`${item.userId}-${item._id}-${item.mlsNum}`}>
        {ListHeader({ data: item })}
        <ItemBodyLayout attached style={{ padding: 10 }}>
          {ImageGroup({ img1src: item.sampleBackLargeUrl, img2src: item.sampleFrontLargeUrl, linkTo: `dashboard/${item._id}` })}

          {ItemList({ data: item })}
        </ItemBodyLayout>
      </ItemLayout>
    ));
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <Segment style={isMobile() ? { marginTop: '58px' } : {}}>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h3">Dashboard</Header>
            </Menu.Item>
          </Menu>
        </Segment>
      </ContentTopHeaderLayout>

      {isInitiating && (
        <ContentBottomHeaderLayout style={isMobile() ? { marginTop: '60px' } : {}}>
          <Progress value={currentUserCompleted} total={currentUserTotal} progress="ratio" inverted success size="tiny" />
        </ContentBottomHeaderLayout>
      )}

      {!isInitiating && !mailoutsPendingState && mailoutList.length === 0 && (
        <ContentBottomHeaderLayout style={isMobile() ? { marginTop: '60px' } : {}}>
          <Segment placeholder>
            <Header icon>
              <Icon name="file outline" />
              No Mailouts found.
            </Header>
          </Segment>
        </ContentBottomHeaderLayout>
      )}

      {mailoutList.length === 0 && mailoutsPendingState && (
        <Segment style={isMobile() ? { marginTop: '129px' } : { marginTop: '75px' }}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Loading />
                  </Grid.Column>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      )}

      {mailoutList.length > 0 && (
        <Segment style={isMobile() ? { marginTop: '129px' } : { marginTop: '75px' }}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <MailoutsList list={mailoutList} />
                  </Grid.Column>
                </Grid.Row>

                {mailoutsPendingState && (
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
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      )}
    </Page>
  );
};

export default Dashboard;
