import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Header, Icon, Menu, Message, Modal, Page, Segment } from '../components/Base';
import InviteTeammatesForm from '../components/Forms/InviteTeammatesForm';
import { passwordReset } from '../store/modules/auth0/actions';
import PageTitleHeader from '../components/PageTitleHeader';
import { syncPending } from '../store/modules/team/actions';
import { ContentTopHeaderLayout } from '../layouts';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const passwordResetPending = useSelector(store => store.auth0.passwordResetPending);
  const passwordResetStatus = useSelector(store => store.auth0.passwordResetDetails?.ok);
  const isSyncing = useSelector(store => store.team.syncPending);
  const syncResponse = useSelector(store => store.team.syncResponse);
  const syncError = useSelector(store => store.team.syncError?.message);
  const isAdmin = useSelector(store => store.onLogin?.permissions?.teamAdmin);
  const onLoginMode = useSelector(store => store.onLogin?.mode);
  const multiUser = onLoginMode === 'multiuser';

  const [modalOpen, setModalOpen] = useState(false);

  const renderPasswordChange = () => {
    return (
      <Segment>
        <Header as="h2">
          Password Change
          <Header.Subheader>Perform password change</Header.Subheader>
        </Header>

        <br />

        <Button primary inverted onClick={() => setModalOpen(true)} loading={passwordResetPending} disabled={passwordResetStatus}>
          {passwordResetStatus ? `Reset Initiated` : `Password Change`}
        </Button>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="small">
          <Header icon="exclamation" content="Password Change" />
          <Modal.Content image>
            <Modal.Description style={{ margin: 'auto' }}>
              <p>By pressing continue, an email with password reset instructions will be sent.</p>
              <p>Please follow the instructions within in to finalize the process.</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="red" type="button" inverted onClick={() => setModalOpen(false)}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green" type="button" inverted onClick={() => [dispatch(passwordReset()), setModalOpen(false)]}>
              <Icon name="checkmark" /> Continue
            </Button>
          </Modal.Actions>
        </Modal>
      </Segment>
    );
  };

  const renderSyncCRM = () => {
    return (
      <Segment>
        <Header as="h2">
          Brivity CRM Sync
          <Header.Subheader>Perform Brivity CRM Sync</Header.Subheader>
        </Header>

        <br />

        <Button primary type="button" inverted onClick={() => dispatch(syncPending())} loading={isSyncing} disabled={isSyncing}>
          <Icon name="sync" /> Sync Now
        </Button>

        {syncResponse?.ok && (
          <Message info>
            <Message.Header>Last Successful Sync</Message.Header>
            <p>
              On {syncResponse.lastSuccessfulSync.split(' ')[0]} at {syncResponse.lastSuccessfulSync.split(' ')[1]}
            </p>
          </Message>
        )}

        {syncError && (
          <Message negative>
            <Message.Header>We're sorry, but there was an error during syncing</Message.Header>
            <p>{syncError}</p>
          </Message>
        )}
      </Segment>
    );
  };

  return (
    <Page basic>
      <ContentTopHeaderLayout>
        <PageTitleHeader>
          <Menu borderless fluid secondary>
            <Menu.Item>
              <Header as="h1">Settings</Header>
            </Menu.Item>
          </Menu>
        </PageTitleHeader>
      </ContentTopHeaderLayout>

      <div style={{ margin: '20px 0' }}>
        {renderPasswordChange()}

        {multiUser && isAdmin && <InviteTeammatesForm settingsPage={true} />}

        {multiUser && isAdmin && renderSyncCRM()}
      </div>
    </Page>
  );
};

export default SettingsPage;
