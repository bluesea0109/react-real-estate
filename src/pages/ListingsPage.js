import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import { Header, Menu, Page, Dropdown } from '../components/Base';
import Styled from 'styled-components';
import { Grid, Segment, Button, Popup, List, Icon, Card, Image } from 'semantic-ui-react';

import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentTopHeaderLayout } from '../layouts';
import { useWindowSize } from '../components/Hooks/useWindowSize';
import StatusPill from '../components/StatusPill';

import auth from '../services/auth';
import api from '../services/api';

import * as brandColors from '../components/utils/brandColors';

export const trimText = (string, length, noDots) => {
  if (string.length <= length) return string;
  if (noDots) return string.substring(0, length);
  if (string.length + 3 < length) return string;
  return string.substring(0, length) + '...';
};

const DotsDropDown = Styled(Dropdown)`
&&&.ui.button{
color: #000000;
&:hover{
  background-color:${brandColors.darkGreyHover}
}
}
`;

const ListingCard = ({ listingDetails, listingItem, userInfo, peerUser, userType }) => {
  const windowSize = useWindowSize();
  const adProduct = useSelector(store => store.onLogin.permissions?.adProduct);
  const history = useHistory();
  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';

  if (!listingItem)
    return (
      <Grid.Column>
        <Segment className="cardSegment">Loading...</Segment>
      </Grid.Column>
    );
  else {
    const title = trimText(
      listingItem.streetAddress,
      windowSize.width <= 1366 ? 13 : windowSize.width <= 1700 ? 15 : 27,
      false
    );
    const subtitle = `${listingItem.city}, ${listingItem.state} ${listingItem.postalCode}`;
    const price = `$${listingItem.price.toLocaleString('en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
    const bed = listingItem ? (listingItem.bedrooms ? listingItem.bedrooms : '-') : '-';
    const bath = listingItem
      ? listingItem.bathsTotalDecimal
        ? listingItem.bathsTotalDecimal
        : '-'
      : '-';

    let userObj = userType === 'loggedIn' ? userInfo : userType === 'peer' && peerUser;

    let createQS = item => {
      let params = { ...listingDetails.adProduct.qs };
      params.listing = item.mlsNum;
      params.mls = item.blueroofMlsId;

      return Object.keys(params)
        .map(param => `${param}=${params[param]}`)
        .join('&');
    };

    const renderPill = status => {
      if (status === 'Active') {
        return (
          <StatusPill type="solid" color="yellow">
            {status}
          </StatusPill>
        );
      } else if (status === 'Pending') {
        return (
          <StatusPill type="solid" color="red">
            {status}
          </StatusPill>
        );
      } else {
        return (
          <StatusPill type="solid" color="astral">
            {status}
          </StatusPill>
        );
      }
    };

    const displayClick = adProduct && multiUser;
    return (
      <Grid.Column className="listingCard" stretched={false}>
        <Segment className="cardSegment">
          <div className="cardImgWrapper">
            <div
              style={displayClick ? null : { cursor: 'default' }}
              className={
                windowSize.width <= 1366
                  ? 'listingCardImgContainerSmall'
                  : 'listingCardImgContainerLarge'
              }
              onClick={
                displayClick
                  ? () =>
                      (window.location = `${listingDetails.adProduct.url}?${createQS(listingItem)}`)
                  : undefined
              }
            >
              <div
                className="listingCardImg"
                style={{
                  backgroundImage: `url(${
                    listingItem.photos.length > 0
                      ? listingItem.photos[0].url
                      : 'https://i0.wp.com/reviveyouthandfamily.org/wp-content/uploads/2016/11/house-placeholder.jpg?ssl=1'
                  })`,
                }}
              />
            </div>
          </div>
          <div className="listingCardBodyContainer">
            <Grid className="centeredRowGrid noMargin cardTopMarginXS">
              <Grid.Column width={11} className="noPaddingTop noPaddingLeft noPaddingBottom">
                <Header
                  as="h3"
                  className="cardFont listingCardTitle"
                  onClick={() =>
                    (window.location = `${listingDetails.adProduct.url}?${createQS(listingItem)}`)
                  }
                >
                  {title}
                </Header>
              </Grid.Column>
              <Grid.Column
                width={5}
                className="noPaddingTop noPaddingRight noPaddingBottom listingStatusPillAlignment defaultCursor"
              >
                {renderPill(
                  listingItem.standardStatus === 'Closed'
                    ? 'Off Market'
                    : listingItem.standardStatus
                )}
              </Grid.Column>
            </Grid>
            <Header as="h4" className="normalFontWeight noMargin cardFont cardTopMarginXS">
              {subtitle}
            </Header>
            <Header as="h5" className="noMargin cardTopMarginS cardFont">
              {price}
              <span className="normalFontWeight"> | </span>
              {bed} bed<span className="normalFontWeight"> | </span>
              {bath} bath
            </Header>
            <Header as="h6" className="noMargin cardTopMarginM cardFont">
              MLS #:{' '}
              <span className="normalFontWeight">
                {listingItem.mlsNum ? listingItem.mlsNum : '-'}
              </span>
            </Header>
            <Grid className="centeredRowGrid cardTopMarginS cardBottomMargin">
              <Grid.Column mobile={3} tablet={3} computer={3} largeScreen={3} widescreen={2}>
                <div className="agentProfileImgContainer">
                  <div
                    className="agentProfileImg"
                    style={{
                      backgroundImage: `url(${
                        userType === 'loggedIn'
                          ? userObj.userProfileImgResized
                          : userObj.realtorPhoto
                      })`,
                    }}
                  />
                </div>
              </Grid.Column>
              <Grid.Column
                mobile={9}
                tablet={9}
                computer={9}
                largeScreen={9}
                widescreen={10}
                className="leftCenteredColumnGrid"
              >
                <Grid.Row className="agentInfoContainer">
                  <Grid.Column>
                    <Header as="h4">{`${userObj.first} ${userObj.last}`}</Header>
                  </Grid.Column>
                  <Grid.Column>
                    <Header as="h6" className="noMargin capsText">
                      Agent
                    </Header>
                  </Grid.Column>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column
                mobile={4}
                tablet={4}
                computer={4}
                largeScreen={4}
                widescreen={4}
                className="alignEnd cardIconButtonColumn"
              >
                {adProduct || listingItem.campaignInfo ? (
                  <DotsDropDown
                    icon="ellipsis horizontal"
                    direction="left"
                    button
                    className="icon cardIconButton"
                  >
                    <DotsDropDown.Menu>
                      {adProduct && (
                        <DotsDropDown.Item
                          onClick={() =>
                            (window.location = `${listingDetails.adProduct.url}?${createQS(
                              listingItem
                            )}`)
                          }
                        >
                          Create Ad
                        </DotsDropDown.Item>
                      )}

                      {listingItem.campaignInfo ? (
                        <DotsDropDown.Item
                          onClick={() =>
                            (window.location = `/dashboard/${listingItem.campaignInfo}`)
                          }
                        >
                          View Postcard Campaign
                        </DotsDropDown.Item>
                      ) : (
                        <DotsDropDown.Item
                          onClick={() => {
                            let filter =
                              listingItem.standardStatus === 'Closed' ? 'sold' : 'listed';
                            history.push({
                              pathname: '/create-postcard',
                              state: {
                                mlsNum: listingItem.mlsNum,
                                filter,
                              },
                            });
                          }}
                        >
                          Create Postcard Campaign
                        </DotsDropDown.Item>
                      )}
                    </DotsDropDown.Menu>
                  </DotsDropDown>
                ) : null}
              </Grid.Column>
            </Grid>
          </div>
        </Segment>
      </Grid.Column>
    );
  }
};

const FilterList = ({ activeFilters, handleFilterSelected }) => {
  return (
    <List relaxed="very" selection>
      <List.Item onClick={() => handleFilterSelected('All')}>
        <Icon
          name={activeFilters.includes('All') ? 'check square' : 'square outline'}
          className={`${'filterIcon'} ${activeFilters.includes('All') && 'filterIconActive'}`}
        />
        <List.Content>
          <List.Description>All Statuses</List.Description>
        </List.Content>
      </List.Item>
      <List.Item onClick={() => handleFilterSelected('Active')}>
        <Icon
          name={activeFilters.includes('Active') ? 'check square' : 'square outline'}
          className={`${'filterIcon'} ${activeFilters.includes('Active') && 'filterIconActive'}`}
        />
        <List.Content>
          <List.Description>Active</List.Description>
        </List.Content>
      </List.Item>
      <List.Item onClick={() => handleFilterSelected('Pending')}>
        <Icon
          name={activeFilters.includes('Pending') ? 'check square' : 'square outline'}
          className={`${'filterIcon'} ${activeFilters.includes('Pending') && 'filterIconActive'}`}
        />
        <List.Content>
          <List.Description>Pending</List.Description>
        </List.Content>
      </List.Item>
      <List.Item onClick={() => handleFilterSelected('Sold')}>
        <Icon
          name={activeFilters.includes('Sold') ? 'check square' : 'square outline'}
          className={`${'filterIcon'} ${activeFilters.includes('Sold') && 'filterIconActive'}`}
        />
        <List.Content>
          <List.Description>Sold / Off Market</List.Description>
        </List.Content>
      </List.Item>
    </List>
  );
};

const ListingsPage = () => {
  const location = useLocation();
  const [listingDetails, setListingDetails] = useState(null);
  const [sortedListings, setsortedListings] = useState(null);
  const [filteredListings, setFitleredListings] = useState(null);
  const [activeFilters, setActiveFilters] = useState(location?.state?.filters || 'All');
  const [userType, setUserType] = useState('loggedIn');

  const peerId = useSelector(store => store.peer.peerId);
  const userProfile = useSelector(store => store.onLogin?.userProfile);
  const userProfileImgResized = useSelector(store => store.onLogin?.realtorPhoto?.resized);

  const userInfo = { ...userProfile, userProfileImgResized };
  const peerUser = useSelector(
    store => store.team?.profiles.filter(profile => profile.userId === peerId)[0]
  );

  const windowSize = useWindowSize();

  useEffect(() => {
    async function fetchData() {
      if (listingDetails) return;
      let path = `/api/user/listings?forgeBlueroofToken=true`;
      if (peerId) path = `/api/user/peer/${peerId}/listings?forgeBlueroofToken=true`;
      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const response = await fetch(path, { headers, method: 'get', credentials: 'include' });
      const results = await api.handleResponse(response);
      setListingDetails(results);
      const newSortedListings = results.listings.sort((a, b) => {
        if (a.listDate < b.listDate) return 1;
        if (a.listDate > b.listDate) return -1;
        return 0;
      });
      setsortedListings(newSortedListings);
    }
    fetchData();
    if (peerId) {
      setUserType('peer');
    } else {
      setUserType('loggedIn');
    }
  }, [listingDetails, peerId]);

  useEffect(() => {
    if (activeFilters.includes('All')) {
      setFitleredListings(sortedListings);
    } else if (activeFilters.includes('Sold')) {
      const newFilteredListings = sortedListings?.filter(
        listing =>
          activeFilters.includes(listing.standardStatus) || listing.standardStatus === 'Closed'
      );
      setFitleredListings(newFilteredListings);
    } else if (activeFilters.includes('Active')) {
      const newFilteredListings = sortedListings?.filter(
        listing =>
          activeFilters.includes(listing.standardStatus) ||
          listing.standardStatus === 'Active Under Contract'
      );
      setFitleredListings(newFilteredListings);
    } else {
      const newFilteredListings = sortedListings?.filter(listing =>
        activeFilters.includes(listing.standardStatus)
      );

      setFitleredListings(newFilteredListings);
    }
  }, [activeFilters, sortedListings]);

  const handleFilterSelected = val => {
    if (val === 'All') {
      setActiveFilters(['All']);
    } else {
      let temp = [...activeFilters];
      let localFilters = temp.filter(el => el !== 'All');

      if (localFilters.find(el => el === val)) {
        if (localFilters.length === 1) {
          setActiveFilters(['All']);
        } else {
          let uniqueLocalFilters = localFilters.filter(filter => filter !== val);
          setActiveFilters(uniqueLocalFilters);
        }
      } else {
        localFilters = [...localFilters, val];
        setActiveFilters(localFilters);
      }
    }
  };

  const getColumns = () => {
    if (windowSize.width >= 3000) {
      return 8;
    }
    if (windowSize.width >= 2000) {
      return 6;
    }
    if (windowSize.width >= 1300) {
      return 4;
    }
    if (windowSize.width >= 1000) {
      return 3;
    }
    if (windowSize.width >= 768) {
      return 2;
    }
    if (windowSize.width >= 320) {
      return 1;
    }
    if (windowSize.width <= 329) {
      return 1;
    }
    return 4;
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Listings</Header>
            </Menu.Item>
            {listingDetails && (
              <Menu.Menu position="right">
                <Popup
                  content={
                    <FilterList
                      activeFilters={activeFilters}
                      handleFilterSelected={handleFilterSelected}
                    />
                  }
                  trigger={<Button primary content="FILTER" className="listingFilterButton" />}
                  position="bottom right"
                  on="click"
                  hideOnScroll
                />
              </Menu.Menu>
            )}
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>
      <div>
        {!listingDetails ? (
          <ContentBottomHeaderLayout>
            <Loading message="Loading Listings..." />
          </ContentBottomHeaderLayout>
        ) : listingDetails?.listings.length > 0 ? (
          <Grid padded="vertically" columns={getColumns()}>
            {filteredListings?.length > 0 ? (
              filteredListings.map((item, i) => {
                return (
                  <ListingCard
                    key={i}
                    listingDetails={listingDetails}
                    listingItem={item}
                    userInfo={userInfo}
                    peerUser={peerUser}
                    userType={userType}
                  />
                );
              })
            ) : activeFilters.includes('All') ? (
              undefined
            ) : sortedListings?.length > 0 ? (
              <Header as="h3" className="normalFontWeight noMargin cardFont noFilteredListingsText">
                No Listings meet the current filtering criteria.
              </Header>
            ) : (
              undefined
            )}
          </Grid>
        ) : (
          <Segment>
            <Card centered style={{ minWidth: '500px', boxShadow: 'none' }}>
              <Image
                centered
                size="large"
                src={require('../assets/listings-page-empty.svg')}
                style={{ background: 'unset', marginTop: '2em', marginBottom: '1em' }}
              />
              <Card.Content style={{ borderTop: 'none' }}>
                <Header as="h5" textAlign="center">
                  <Header.Content style={{ textAlign: 'center', cursor: 'default' }}>
                    <p>
                      Your listings will appear here. If you haven't done so yet, <br />
                      <Link to="/profile" className="briv-marketerLink">
                        add your MLS and Agent ID on the &quot;Profile&quot; page
                      </Link>
                      .
                    </p>
                  </Header.Content>
                </Header>
              </Card.Content>
            </Card>
          </Segment>
        )}
      </div>
    </Page>
  );
};

export default ListingsPage;
