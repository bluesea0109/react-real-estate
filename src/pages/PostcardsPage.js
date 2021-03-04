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
import {
  getFilteredMailoutsPending,
  getMailoutsPending,
  getMoreMailoutsPending,
} from '../store/modules/mailouts/actions';
import { setCompletedDashboardModal } from '../store/modules/onboarded/actions';
import {
  Button,
  Dropdown,
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
  StyledMenu,
} from '../components/Base';
import IframeGroup from '../components/MailoutListItem/IframeGroup';
import ListHeader from '../components/MailoutListItem/ListHeader';
import ItemList from '../components/MailoutListItem/ItemList';
import PageTitleHeader from '../components/PageTitleHeader';
import { useIsMobile } from '../components/Hooks/useIsMobile';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { resetMailout } from '../store/modules/mailout/actions';

const SearchContainer = styled(Menu.Item)`
  &&& {
    flex: 1 0 250px;
    max-width: 600px;
  }
`;

const StyledDropdown = styled(Dropdown)`
  && .visible.menu.transition {
    min-width: 100% !important;
    max-height: 50vh;
  }
  &&&.button {
    border-radius: 4px;
    font-weight: normal;
    text-transform: capitalize;
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

const CampaignSearch = ({ filterValue, sortValue, setSearchValue }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');

  const handleSearchChange = useCallback(
    debounce(async (searchValue, filterValue, sortValue) => {
      setSearchValue(searchValue);
      dispatch(getFilteredMailoutsPending({ searchValue, filterValue, sortValue }));
    }, 500),
    []
  );

  return (
    <SearchContainer>
      <Input
        fluid
        icon="search"
        placeholder="Search by Name, Address or MLS number"
        value={value}
        onChange={e => {
          setValue(e.target.value);
          handleSearchChange(e.target.value, filterValue, sortValue);
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
  const error = useSelector(store => store.mailouts.error?.message);
  const mailoutList = useSelector(store => store.mailouts?.list);
  const filteredList = useSelector(store => store.mailouts?.filteredList);
  const isFiltered = filteredList?.length > 0;
  const filteredPending = useSelector(store => store.mailouts?.filteredPending);
  const [searchValue, setSearchValue] = useState(null);
  const [sortValue, setSortValue] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const [filterText, setFilterText] = useState(null);

  useEffect(() => {
    dispatch(resetMailout());
    // eslint-disable-next-line
  }, []);

  const sortOptions = [
    { key: 0, text: 'Created (Newest First)', value: 'createdDateDesc' },
    { key: 1, text: 'Created (Oldest First)', value: 'createdDateAsc' },
    { key: 2, text: 'Sent (Newest First)', value: 'sendDateDesc' },
    { key: 3, text: 'Sent (Oldest First)', value: 'sendDateAsc' },
  ];

  const filterOptions = [
    { key: 0, text: 'Unsent', value: 'unsent' },
    { key: 1, text: 'Sent (All sent statuses)', value: 'approved' },
    { key: 2, text: 'Sent (Queued for printing)', value: 'queued-for-printing' },
    { key: 3, text: 'Sent (Printing)', value: 'printing' },
    { key: 4, text: 'Sent (Mailing)', value: 'mailing' },
    { key: 5, text: 'Sent (Complete)', value: 'complete' },
  ];

  useFetching(getMailoutsPending, onboarded, useDispatch());

  const handleFilterOrSort = async (type, value) => {
    let filter = filterValue;
    let sort = sortValue;
    type === 'filter' ? (filter = value) : (sort = value);
    dispatch(getFilteredMailoutsPending({ searchValue, filterValue: filter, sortValue: sort }));
  };

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
    if (filteredList?.length > 0) {
      filteredList.map((item, index) => {
        const mailoutItemElement = document.querySelector(`#mailout-iframe-set-${index}`);
        return mailoutItemElementArray.push(mailoutItemElement);
      });
      createObserver();
    } else if (mailoutList?.length > 0) {
      mailoutList.map((item, index) => {
        const mailoutItemElement = document.querySelector(`#mailout-iframe-set-${index}`);
        return mailoutItemElementArray.push(mailoutItemElement);
      });
      createObserver();
    }
  }, [filteredList, mailoutList, mailoutItemElementArray, createObserver]);

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
          <StyledMenu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Postcards</Header>
            </Menu.Item>
            <CampaignSearch
              filterValue={filterValue}
              setSearchValue={setSearchValue}
              sortValue={sortValue}
            />
            <Menu.Item>
              <StyledDropdown
                onChange={(e, { value }) => {
                  setSortValue(value);
                  handleFilterOrSort('sort', value);
                }}
                options={sortOptions}
                placeholder="Sort By"
                selection
                value={sortValue}
              />
            </Menu.Item>
            <Menu.Item>
              <StyledDropdown
                button
                className="icon"
                clearable
                floating
                icon="filter"
                labeled
                onChange={(e, { value }) => {
                  console.log(value);
                  setFilterValue(value);
                  handleFilterOrSort('filter', value);
                  filterOptions.forEach(option => {
                    if (option.value === value) setFilterText(option.text);
                  });
                }}
                options={filterOptions}
                selection
                text={filterText || 'Filter'}
              />
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

      {error && <Snackbar error>{error}</Snackbar>}

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
          <ModalWelcome.Content style={{ color: '#686868', fontSize: '16px', padding: '30px 0px' }}>
            <p>
              We have generated some initial campaigns for you! Please note, when you initially sign
              up, you may not see all listings due to:
            </p>
            <ul style={{ lineHeight: '30px' }}>
              <li>Listings older than 6 months are not included</li>
              <li>We only show a maximum of 15 previous listings from the past</li>
              <li>
                For some boards, sold listings wont show up yet. But upcoming sold listings will
                create new campaigns
              </li>
              <li>
                We exclude listing types (e.g. commercial/land) and locations (e.g. rural locations)
                that are difficult for our system to target
              </li>
              <li>
                We find your listings based on the MLS board/agent id in the Profile section of each
                user. Modifying agent ids will adjust this list
              </li>
            </ul>
          </ModalWelcome.Content>
          <ModalWelcome.Actions style={{ borderTop: 'none', padding: '0px' }}>
            <Button primary onClick={dismissDashboardExplanation}>
              <Icon name="checkmark" /> Ok
            </Button>
          </ModalWelcome.Actions>
        </ModalWelcome>

        {(isInitiatingTeam ||
          isInitiatingUser ||
          (mailoutsPendingState && !mailoutList.length) ||
          filteredPending) && (
          <Loader active inline="centered">
            Loading...
          </Loader>
        )}

        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              {(searchValue && filteredList?.length) ||
              (!searchValue && mailoutList?.length && !filteredPending) ? (
                <MailoutsList
                  list={filteredList?.length ? filteredList : mailoutList}
                  searching={filteredPending}
                />
              ) : (
                !filteredPending &&
                !mailoutsPendingState && (
                  <Header icon textAlign="center">
                    <Icon name="file outline" />
                    No Campaigns found.
                  </Header>
                )
              )}
            </Grid.Column>
          </Grid.Row>

          {canLoadMore && !isFiltered && !searchValue && !filteredPending && (
            <Grid.Row>
              <Grid.Column width={16}>
                <Grid centered columns={2}>
                  <Grid.Column>
                    <Button
                      id="loadMoreButton"
                      attached="bottom"
                      content={
                        mailoutsPendingState ? (
                          <Loader active size="tiny" inline="centered" />
                        ) : (
                          'Load More'
                        )
                      }
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
    </Page>
  );
};

export default PostcardsPage;
