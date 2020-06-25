import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { Header, Menu, Page, Segment } from '../components/Base';
import { Table } from 'semantic-ui-react';
import { format } from 'date-fns';

import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentSpacerLayout, ContentTopHeaderLayout } from '../layouts';
import { isMobile } from '../components/utils';
import auth from '../services/auth';
import api from '../services/api';


const BillingPage = () => {
  const isAdmin = useSelector(store => store.onLogin?.permissions?.teamAdmin);
  const onLoginMode = useSelector(store => store.onLogin?.mode);
  const multiUser = onLoginMode === 'multiuser';
  const [billingDetails, setBillingDetails] = useState(null)

  useEffect(() => {
    async function fetchData () {
      if (billingDetails) return
      let path = `/api/user/team/settings/billings`
      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const response = await fetch(path, { headers, method: 'get', credentials: 'include' });
      const results = await api.handleResponse(response)

      console.log(results)
      setBillingDetails(results)
    }
    fetchData()
  }, [billingDetails])

  const tableBody = () => {

    return billingDetails.billings.map((item, index) => (
      <Table.Row key="{item.id}">
        <Table.Cell>{format(new Date(item.billingDate), 'MM/dd/yyyy')}</Table.Cell>
        <Table.Cell>
          <Link to={`dashboard/${item.id}`}>{item.name}</Link>
        </Table.Cell>
        <Table.Cell>{item.recipientCount}</Table.Cell>
        <Table.Cell>${item.creditsAmountApplied || '0.00'}</Table.Cell>
        <Table.Cell>{item.userProfile.first} {item.userProfile.last}</Table.Cell>
        <Table.Cell>{item.approvedByUser.first} {item.approvedByUser.last}</Table.Cell>
        <Table.Cell>${(Number(item.amount_in_cents) + Number(item.tax_amount_in_cents)) / 100}</Table.Cell>
      </Table.Row>
    ));
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Billing</Header>
            </Menu.Item>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>
      <ContentSpacerLayout />
      <div style={isMobile() ? { marginTop: '80px' } : { marginTop: '85px' }}>

        {multiUser && isAdmin && (


          <Segment>

            <ContentBottomHeaderLayout>
              {!billingDetails && <Loading message="Retriving billing information..." />}
            </ContentBottomHeaderLayout>
            {billingDetails && (
              <Table basic='very' className="BillingTable">
                 <Table.Header>
                   <Table.Row>
                     <Table.HeaderCell>Date</Table.HeaderCell>
                     <Table.HeaderCell>Campaign Title</Table.HeaderCell>
                     <Table.HeaderCell>Recipients</Table.HeaderCell>
                     <Table.HeaderCell>Credits Applied</Table.HeaderCell>
                     <Table.HeaderCell>Profile</Table.HeaderCell>
                     <Table.HeaderCell>Approved By</Table.HeaderCell>
                     <Table.HeaderCell>Cost</Table.HeaderCell>
                   </Table.Row>
                 </Table.Header>

                 <Table.Body>
                   {tableBody()}
                 </Table.Body>
                </Table>
            )}

          </Segment>
        )}
      </div>
    </Page>
  );
};

export default BillingPage;
