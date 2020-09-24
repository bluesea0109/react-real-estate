import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { Header, Menu, Page } from '../components/Base';
import { Grid, Segment, Dropdown } from 'semantic-ui-react';

import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentSpacerLayout, ContentTopHeaderLayout } from '../layouts';
import { isMobile } from '../components/utils';

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
      console.log(listingItem.photos.length > 0 ? listingItem.photos[0].url : '')
      const title = listingItem.streetAddress;
      const subtitle = `${listingItem.city}, ${listingItem.state} ${listingItem.postalCode}`;
      const price = listingItem.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      const bed = '4 bed'
      const bath = '3 bath';
      const sqft = '2,392 sqft';

      let createQS = (item) => {
        let params = {...listingDetails.adProduct.qs}
        params.listing = item.mlsNum
        params.mls = item.blueroofMlsId
        return Object.keys(params).map(param => `${param}=${params[param]}`).join('&');
      }

      return(
        <Grid.Column>
          <Segment className="cardSegment">
            <div className="cardImgWrapper">
              <div className="listingCardImgContainer">
                <div className="listingCardImg" style={{ backgroundImage:`url(${listingItem.photos.length > 0 ? listingItem.photos[0].url : 'https://i0.wp.com/reviveyouthandfamily.org/wp-content/uploads/2016/11/house-placeholder.jpg?ssl=1'})`}} />
              </div>
              <div className="imgPillContainer">
                <div className="statusPill floatPill capsText">Listing</div>
              </div>
            </div>
            <div className="listingCardBodyContainer">
              <Grid className="centeredRowGrid noMargin cardTopMarginXS">
                <Grid.Column width={10} className='noPaddingTop noPaddingLeft noPaddingBottom'>
                  <Header as="h3" className="cardFont">{title}</Header>
                </Grid.Column>
                <Grid.Column width={6} className='noPaddingTop noPaddingRight noPaddingBottom'>
                  <div className="statusPill redPill capsText">Pending</div>
                </Grid.Column>
              </Grid>
              <Header as="h4" className="normalFontWeight noMargin cardFont cardTopMarginXS">{subtitle}</Header>
              <Header as="h5" className="noMargin cardTopMarginS cardFont">{price}<span className="normalFontWeight"> | </span>{bed}<span className="normalFontWeight"> | </span>{bath}<span className="normalFontWeight"> | </span>{sqft}</Header>
              <Header as="h6" className="noMargin cardTopMarginM cardFont">MLS #: <span className="normalFontWeight">12345</span></Header>
              <Grid className="centeredRowGrid cardTopMarginS cardBottomMargin">
                <Grid.Column width={3}>
                  <div className='agentProfileImgContainer'>
                    <div className="agentProfileImg" style={{ backgroundImage: `url(https://www.andrewcollings.com/wp-content/uploads/2019/06/Hero-01-009-Chicago-Studio-Corporate-Headshot.jpg-V.jpg-1024x683-JPG60.JPG-1024x683.jpg)` }} />
                  </div>
                </Grid.Column>
                <Grid.Column width={9} className="leftCenteredColumnGrid">
                  <Grid.Row>
                    <Grid.Column>
                      <Header as="h4">Kyle Williams</Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as="h6" className="noMargin capsText">Agent</Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column width={4} className="alignEnd">
                  <Dropdown
                    icon="ellipsis horizontal"
                    direction="left"
                    button
                    className="icon cardIconButton"
                  >
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() =>
                        window.location = `${listingDetails.adProduct.url}?${createQS(listingItem)}`
                        }>
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

  // const tableBody = () => {
  //
  //   let createQS = (item) => {
  //     let params = {...listingDetails.adProduct.qs}
  //     params.listing = item.mlsNum
  //     params.mls = item.blueroofMlsId
  //     return Object.keys(params).map(param => `${param}=${params[param]}`).join('&')
  //   }
  //
  //   return listingDetails.listings.map((item, index) => (
  //     <Table.Row key="{item.mlsNum}">
  //       <Table.Cell>{item.streetAddress}</Table.Cell>
  //       <Table.Cell>{item.mlsNum}</Table.Cell>
  //       <Table.Cell>{item.standardStatus}</Table.Cell>
  //       <Table.Cell><a href={`${listingDetails.adProduct.url}?${createQS(item)}`}>Create Ad</a></Table.Cell>
  //     </Table.Row>
  //   ));
  // };
  console.log({listingDetails});
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
          {/* {listingDetails && (
            <Table basic='very' className="BillingTable">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Address</Table.HeaderCell>
                    <Table.HeaderCell>MLS</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {tableBody()}
                </Table.Body>
              </Table>
          )} */}
          <Grid container doubling stackable columns={3} className="listingsMainContainer" >
            {listingDetails ? listingDetails.listings.map((item, i) => {
              return <ListingCard key={i} listingItem={item} />
            }) : undefined}

            {/* <ListingCard />
            <ListingCard />
            <ListingCard />
            <ListingCard />
            <ListingCard />
            <ListingCard /> */}
          </Grid>
        </div>
      </div>
    </Page>
  );

}

export default ListingsPage;
