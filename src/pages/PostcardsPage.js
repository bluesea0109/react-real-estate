import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Progress } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import {
  ContentBottomHeaderLayout,
  ContentTopHeaderLayout,
  ItemBodyLayout,
  ItemLayout,
} from '../layouts';
import { getMailoutsPending, getMoreMailoutsPending } from '../store/modules/mailouts/actions';
import { setCompletedDashboardModal } from '../store/modules/onboarded/actions';
import {
  Button,
  Grid,
  Header,
  Icon,
  Input,
  Loader,
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
import { useIsMobile } from '../components/Hooks/useIsMobile';
import styled from 'styled-components';
import { debounce } from 'lodash';
import auth from '../services/auth';

const SearchContainer = styled(Menu.Item)`
  &&& {
    flex: 1 0 250px;
    max-width: 600px;
  }
`;

const ModalWelcome = styled(Modal)`
  &&& {
    width: 70%;
  }
  @media only screen and (max-width: 800px) {
    &&& {
      width: 90%;
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

const CampaignSearch = ({ mailoutList, setFilteredListings, setIsFiltered, setIsSearching }) => {
  const [searchValue, setSearchValue] = useState('');
  const peerId = useSelector(store => store.peer?.peerId);

  const getSearchCampaigns = async value => {
    if (!value) return [];
    let path = `/api/user/mailout/search?text=${value}`;
    if (peerId) path = `/api/user/peer/${peerId}/mailout/search?text=${value}`;
    const headers = {};
    const accessToken = await auth.getAccessToken();
    headers['authorization'] = `Bearer ${accessToken}`;
    const searchRes = await fetch(path, { headers, method: 'get', credentials: 'include' });
    const data = await searchRes.json();
    return data;
  };

  const handleSearchChange = useCallback(
    debounce(async (value, listings) => {
      setIsSearching(true);
      if (!value.length) {
        setFilteredListings(listings);
        setIsSearching(false);
      } else {
        let newListings = await getSearchCampaigns(value);
        newListings.length ? setFilteredListings(newListings) : setFilteredListings(null);
        setIsFiltered(true);
        setIsSearching(false);
      }
    }, 500),
    []
  );

  return (
    <SearchContainer>
      <Input
        fluid
        icon="search"
        placeholder="Search by Name, Address or MLS number"
        value={searchValue}
        onChange={e => {
          setSearchValue(e.target.value);
          handleSearchChange(e.target.value, mailoutList);
        }}
      />
    </SearchContainer>
  );
};

const PostcardsPage = () => {
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
  const [filteredListings, setFilteredListings] = useState(mailoutList);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    !filteredListings?.length && setFilteredListings(mailoutList);
    // eslint-disable-next-line
  }, [mailoutList]);

  useFetching(getMailoutsPending, onboarded, useDispatch());

  const boundFetchMoreMailouts = value => dispatch(getMoreMailoutsPending(value));

  const dismissDashboardExplanation = value => dispatch(setCompletedDashboardModal(value));

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
        if (mailoutItemElement instanceof Element) return observer.observe(mailoutItemElement);
      });
    }
  }, [mailoutItemElementArray]);

  useEffect(() => {
    if (filteredListings && filteredListings.length > 0) {
      filteredListings.map((item, index) => {
        const mailoutItemElement = document.querySelector(`#mailout-iframe-set-${index}`);

        return mailoutItemElementArray.push(mailoutItemElement);
      });

      createObserver();
    }
  }, [filteredListings, mailoutList, mailoutItemElementArray, createObserver]);

  const MailoutsList = ({ list, searching }) => {
    if (searching && !list?.length) return <div>No listings match your search criteria</div>;
    if (!list || list[0]?.started) return null;
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
            <CampaignSearch
              mailoutList={mailoutList}
              setFilteredListings={setFilteredListings}
              setIsFiltered={setIsFiltered}
              setIsSearching={setIsSearching}
            />
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
              {mailoutsPendingState ||
              isInitiatingTeam ||
              isInitiatingUser ||
              mailoutsPendingState ||
              isSearching ? (
                <Loader active inline="centered">
                  Loading...
                </Loader>
              ) : (
                <Grid.Column width={16}>
                  <MailoutsList list={filteredListings} searching={isSearching} />
                </Grid.Column>
              )}
            </Grid.Row>

            {canLoadMore && !isFiltered && !isSearching && (
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
    </Page>
  );
};

export default PostcardsPage;
