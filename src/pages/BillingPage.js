import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import { Button, Header, Icon, Menu, Message, Modal, Page, Segment } from '../components/Base';
import InviteTeammatesForm from '../components/Forms/InviteTeammatesForm';
import { passwordReset } from '../store/modules/auth0/actions';
import PageTitleHeader from '../components/PageTitleHeader';
import { ContentBottomHeaderLayout, ContentSpacerLayout, ContentTopHeaderLayout, ItemHeaderLayout, ItemHeaderMenuLayout } from '../layouts';
import { isMobile } from '../components/utils';

const BillingPage = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(store => store.onLogin?.permissions?.teamAdmin);
  const onLoginMode = useSelector(store => store.onLogin?.mode);
  const multiUser = onLoginMode === 'multiuser';
  const [billingDetails, setBillingDetails] = useState(null)

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
              <Header as="h4" style={{ marginLeft: '1.5em', marginBottom: '-0.5em' }}>
                Billing Details
              </Header>
            )}

          </Segment>
        )}
      </div>
    </Page>
  );
};

export default BillingPage;
