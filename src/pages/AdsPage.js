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
  const [adDetails, setAdDetails] = useState(null)
  const peerId = useSelector(store => store.peer.peerId)

  useEffect(() => {
    async function fetchData () {
      if (adDetails) return
      let path = `/api/user/ads/list`
      if (peerId) path = `/api/user/peer/${peerId}/ads/list`

      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const response = await fetch(path, { headers, method: 'get', credentials: 'include' });
      const results = await api.handleResponse(response)
      setAdDetails(results)
    }
    fetchData()
  }, [adDetails, peerId])

  const tableBody = () => {
    return adDetails.map((item, index) => (
      <Table.Row key="{item.mlsNum}">
        <Table.Cell>{item.campaignName}</Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell>{item.startDate} - {item.endDate}</Table.Cell>
        <Table.Cell>{item.budget}</Table.Cell>
      </Table.Row>
    ));
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Ads</Header>
            </Menu.Item>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>
      <ContentSpacerLayout />
      <div style={isMobile() ? { marginTop: '80px' } : { marginTop: '95px' }}>
        <Segment>
          <ContentBottomHeaderLayout>
            {!adDetails && <Loading message="Loading Listings..." />}
          </ContentBottomHeaderLayout>
          {adDetails && (
            <Table basic='very' className="BillingTable">
               <Table.Header>
                 <Table.Row>
                   <Table.HeaderCell>Campaign Name</Table.HeaderCell>
                   <Table.HeaderCell>Preview</Table.HeaderCell>
                   <Table.HeaderCell>Dates</Table.HeaderCell>
                   <Table.HeaderCell>Budget</Table.HeaderCell>
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
