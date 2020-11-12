import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { Header, Menu, Page, Segment, Image, Card } from '../components/Base';
import { Table } from 'semantic-ui-react';
import { format } from 'date-fns';

import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentTopHeaderLayout } from '../layouts';
import auth from '../services/auth';
import api from '../services/api';
import { postcardDimensionsDisplayed } from '../components/utils/utils';

const BillingPage = () => {
  const isAdmin = useSelector(store => store.onLogin?.permissions?.teamAdmin);
  const [billingDetails, setBillingDetails] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (billingDetails) return;
      let path = `/api/user/team/settings/billings`;
      if (!isAdmin) path = `/api/user/settings/billings`;
      const headers = {};
      const accessToken = await auth.getAccessToken();
      headers['authorization'] = `Bearer ${accessToken}`;
      const response = await fetch(path, { headers, method: 'get', credentials: 'include' });
      const results = await api.handleResponse(response);
      setBillingDetails(results);
    }
    fetchData();
  }, [billingDetails, isAdmin]);

  const tableBody = () => {
    return billingDetails.billings.map((item, index) => (
      <Table.Row key={item.id}>
        <Table.Cell>{format(new Date(item.billingDate), 'MM/dd/yyyy')}</Table.Cell>
        <Table.Cell>
          <Link to={`dashboard/${item.id}`}>{item.name}</Link>
        </Table.Cell>
        <Table.Cell>
          {item.postcardSize
            ? `${postcardDimensionsDisplayed(item.postcardSize)}" Postcard`
            : `4x6" Postcard`}
        </Table.Cell>
        <Table.Cell>{item.recipientCount}</Table.Cell>
        <Table.Cell>${item.creditsAmountApplied || '0.00'}</Table.Cell>
        <Table.Cell>
          {item.userProfile.first} {item.userProfile.last}
        </Table.Cell>
        {item.approvedByUser && (
          <Table.Cell>
            {item.approvedByUser.first} {item.approvedByUser.last}
          </Table.Cell>
        )}
        {!item.approvedByUser && <Table.Cell></Table.Cell>}
        <Table.Cell>
          ${(Number(item.amount_in_cents) + Number(item.tax_amount_in_cents)) / 100}
        </Table.Cell>
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
          {!isAdmin && billingDetails && !billingDetails.billings.length && (
            <p id="billingSubHeader">
              Billing is connected to your team&apos;s administrator by default. If a user would
              like to be billed directly, please contact{' '}
              <a href="mailto:support@brivity.com">support@brivity.com</a>
            </p>
          )}
        </PageTitleHeader>
      </ContentTopHeaderLayout>
      <div style={{ margin: '20px 0' }}>
        <Segment>
          <ContentBottomHeaderLayout style={{ minHeight: 0 }}>
            {!billingDetails && <Loading message="Retrieving billing information..." />}
          </ContentBottomHeaderLayout>
          {billingDetails && !!billingDetails.billings.length && (
            <Table basic="very" className="BillingTable">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Campaign Title</Table.HeaderCell>
                  <Table.HeaderCell>Campaign Type</Table.HeaderCell>
                  <Table.HeaderCell>Recipients</Table.HeaderCell>
                  <Table.HeaderCell>Credits Applied</Table.HeaderCell>
                  <Table.HeaderCell>Profile</Table.HeaderCell>
                  <Table.HeaderCell>Approved By</Table.HeaderCell>
                  <Table.HeaderCell>Cost</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>{tableBody()}</Table.Body>
            </Table>
          )}
          {billingDetails && !billingDetails.billings.length && (
            <Card centered style={{ minWidth: '380px', boxShadow: 'none' }}>
              <Image
                centered
                size="large"
                src={require('../assets/Billing_empty_state.png')}
                style={{ background: 'unset', marginTop: '1em' }}
              />
              <Card.Content style={{ borderTop: 'none' }}>
                <Header as="h5" textAlign="center">
                  <Header.Content style={{ width: '380px', textAlign: 'center' }}>
                    Your billing invoices will appear here
                  </Header.Content>
                </Header>
              </Card.Content>
            </Card>
          )}
        </Segment>
      </div>

      {billingDetails && billingDetails.credits && (
        <div style={{ margin: '20px 0' }}>
          <Segment>
            <ContentBottomHeaderLayout style={{ minHeight: 0 }}>
              <p>
                <span style={{ fontWeight: 'bold' }}>Credit Balance: </span> $
                {billingDetails.credits}
              </p>
            </ContentBottomHeaderLayout>
          </Segment>
        </div>
      )}
    </Page>
  );
};

export default BillingPage;
