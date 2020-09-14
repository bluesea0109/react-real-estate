import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { Header, Menu, Page, Segment } from '../components/Base';
import { Table } from 'semantic-ui-react';

import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentSpacerLayout, ContentTopHeaderLayout } from '../layouts';
import { isMobile } from '../components/utils';

import auth from '../services/auth';
import api from '../services/api';

const EmptyPage = () => {
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
  }, [listingDetails, peerId])

  const tableBody = () => {

    let createQS = (item) => {
      let params = {...listingDetails.adProduct.qs}
      params.listing = item.mlsNum
      params.mls = item.blueroofMlsId
      return Object.keys(params).map(param => `${param}=${params[param]}`).join('&')
    }

    return listingDetails.listings.map((item, index) => (
      <Table.Row key="{item.mlsNum}">
        <Table.Cell>{item.streetAddress}</Table.Cell>
        <Table.Cell>{item.mlsNum}</Table.Cell>
        <Table.Cell>{item.standardStatus}</Table.Cell>
        <Table.Cell><a href={`${listingDetails.adProduct.url}?${createQS(item)}`}>Create Ad</a></Table.Cell>
      </Table.Row>
    ));
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
        <Segment>
          <ContentBottomHeaderLayout>
            {!listingDetails && <Loading message="Loading Listings..." />}
          </ContentBottomHeaderLayout>
          {listingDetails && (
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
          )}
        </Segment>
      </div>
    </Page>
  );

}

export default EmptyPage;
