import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { Header, Menu, Page } from '../components/Base';
import { Grid, Segment, Dropdown } from 'semantic-ui-react';

import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentSpacerLayout, ContentTopHeaderLayout } from '../layouts';
import { isMobile } from '../components/utils';
import StatusPill from '../components/StatusPill';

import auth from '../services/auth';
import api from '../services/api';

const ListingsPage = () => {
  const [listingDetails, setListingDetails] = useState(null)
  const peerId = useSelector(store => store.peer.peerId)

  useEffect(() => {
    async function fetchData () {
      if (listingDetails) return
      let path = `/api/user/listings?forgeBlueroofToken=true`
      if (peerId) path = `/api/user/peer/${peerId}/listings?forgeBlueroofToken=true`
      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const response = await fetch(path, { headers, method: 'get', credentials: 'include' });
      const results = await api.handleResponse(response)
      setListingDetails(results)
    }
    fetchData()
  }, [listingDetails, peerId]);

  const ListingCard = ({listingItem}) => {
    if(!listingItem) return (<Grid.Column><Segment className="cardSegment">Loading...</Segment></Grid.Column>)
    else{
      const title = listingItem.streetAddress;
      const subtitle = `${listingItem.city}, ${listingItem.state} ${listingItem.postalCode}`;
      const price = `$${listingItem.price.toLocaleString('en', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
      const bed = '4 bed';
      const bath = '3 bath';
      const sqft = '2,392 sqft';

      let createQS = (item) => {
        let params = {...listingDetails.adProduct.qs}
        params.listing = item.mlsNum
        params.mls = item.blueroofMlsId
        return Object.keys(params).map(param => `${param}=${params[param]}`).join('&');
      }
      return(
        <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={5} widescreen={4} >
          <Segment className="cardSegment">
            <div className="cardImgWrapper">
              <div className="listingCardImgContainer">
                <div className="listingCardImg" style={{ backgroundImage:`url(${listingItem.photos.length > 0 ? listingItem.photos[0].url : 'https://i0.wp.com/reviveyouthandfamily.org/wp-content/uploads/2016/11/house-placeholder.jpg?ssl=1'})`}} />
              </div>
              <div className="imgPillContainer">
                <StatusPill type="paper">Listing</StatusPill>
              </div>
            </div>
            <div className="listingCardBodyContainer">
              <Grid className="centeredRowGrid noMargin cardTopMarginXS">
                <Grid.Column width={10} className='noPaddingTop noPaddingLeft noPaddingBottom'>
                  <Header as="h3" className="cardFont">{title}</Header>
                </Grid.Column>
                <Grid.Column width={6} className='noPaddingTop noPaddingRight noPaddingBottom'>
                  <StatusPill type="opaque" color={listingItem.standardStatus === 'Pending' && 'red'}>{listingItem.standardStatus}</StatusPill>
                </Grid.Column>
              </Grid>
              <Header as="h4" className="normalFontWeight noMargin cardFont cardTopMarginXS">{subtitle}</Header>
              <Header as="h5" className="noMargin cardTopMarginS cardFont">{price}<span className="normalFontWeight"> | </span>{bed}<span className="normalFontWeight"> | </span>{bath}<span className="normalFontWeight"> | </span>{sqft}</Header>
              <Header as="h6" className="noMargin cardTopMarginM cardFont">MLS #: <span className="normalFontWeight">12345</span></Header>
              <Grid className="centeredRowGrid cardTopMarginS cardBottomMargin">
                <Grid.Column mobile={3} tablet={3} computer={3} largeScreen={3}  widescreen={2} >
                  <div className='agentProfileImgContainer'>
                    <div className="agentProfileImg" style={{ backgroundImage: `url(https://www.andrewcollings.com/wp-content/uploads/2019/06/Hero-01-009-Chicago-Studio-Corporate-Headshot.jpg-V.jpg-1024x683-JPG60.JPG-1024x683.jpg)` }} />
                  </div>
                </Grid.Column>
                <Grid.Column mobile={9} tablet={9} computer={9} largeScreen={9} widescreen={10}  className="leftCenteredColumnGrid">
                  <Grid.Row className="agentInfoContainer">
                    <Grid.Column>
                      <Header as="h4">Kyle Williams</Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as="h6" className="noMargin capsText">Agent</Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column mobile={4} tablet={4} computer={4} largeScreen={4} widescreen={4}  className="alignEnd">
                  <Dropdown
                    icon="ellipsis horizontal"
                    direction="left"
                    button
                    className="icon cardIconButton"
                  >
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => window.location = `${listingDetails.adProduct.url}?${createQS(listingItem)}`}>
                        View Facebook Ad
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Grid.Column>
              </Grid>
            </div>
          </Segment>
        </Grid.Column>
      );
    }
  };
  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Listings</Header>
            </Menu.Item>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>
      <ContentSpacerLayout />
      <div style={isMobile() ? { marginTop: '80px' } : { marginTop: '95px' }}>
        <div>
          <ContentBottomHeaderLayout>
            {!listingDetails && <Loading message="Loading Listings..." />}
          </ContentBottomHeaderLayout>
          <Grid stackable className='mainGridContainer' >
            {listingDetails ? listingDetails.listings.map((item, i) => {
              return <ListingCard key={i} listingItem={item} />
            }) : undefined}
          </Grid>
        </div>
      </div>
    </Page>
  );

}

export default ListingsPage;
