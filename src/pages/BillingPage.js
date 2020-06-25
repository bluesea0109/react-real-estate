import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { Button, Header, Icon, Menu, Message, Modal, Page, Segment } from '../components/Base';
import { Table } from 'semantic-ui-react';

import InviteTeammatesForm from '../components/Forms/InviteTeammatesForm';
import { passwordReset } from '../store/modules/auth0/actions';
import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentSpacerLayout, ContentTopHeaderLayout, ItemHeaderLayout, ItemHeaderMenuLayout } from '../layouts';
import { isMobile } from '../components/utils';
import auth from '../services/auth';
import api from '../services/api';


const BillingPage = () => {
  const dispatch = useDispatch();
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


  console.log(billingDetails)
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
              <Table celled>
                 <Table.Header>
                   <Table.Row>
                     <Table.HeaderCell>Date</Table.HeaderCell>
                     <Table.HeaderCell>Campaign Title</Table.HeaderCell>
                     <Table.HeaderCell>Postcards Sent</Table.HeaderCell>
                     <Table.HeaderCell>Credits Used</Table.HeaderCell>
                     <Table.HeaderCell>Total Amount</Table.HeaderCell>
                   </Table.Row>
                 </Table.Header>

                 <Table.Body>
                   <Table.Row>
                     <Table.Cell>March 21, 2020</Table.Cell>
                     <Table.Cell>123 Link Road</Table.Cell>
                     <Table.Cell>180</Table.Cell>
                     <Table.Cell>0</Table.Cell>
                     <Table.Cell>$128.27</Table.Cell>
                   </Table.Row>
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
