import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from 'semantic-ui-react';

import AuthService from '../services/auth';
import { Page, Segment, Button, Modal, Icon, Image, Message } from '../components/Base';
import InviteTeammatesForm from '../components/Forms/InviteTeammatesForm';
import { syncPending } from '../store/modules/team/actions';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const isSyncing = useSelector(store => store.team.syncPending);
  const syncResponse = useSelector(store => store.team.syncResponse);
  const syncError = useSelector(store => store.team.syncError);
  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';

  const [modalOpen, setModalOpen] = useState(false);

  const renderPasswordChange = () => {
    return (
      <Segment>
        <Header as="h1">
          Password Change
          <Header.Subheader>Perform password change</Header.Subheader>
        </Header>

        <Button onClick={() => setModalOpen(true)}>Password Change</Button>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} basic size="small">
          <Header icon="exclamation" content="Password Change" />
          <Modal.Content image>
            <Image wrapped size="medium" src={require('../assets/password-change.jpg')} />
            <Modal.Description style={{ margin: 'auto' }}>
              <p>To change password please follow these instructions.</p>
              <p>First, press "Continue".</p>
              <p>You will be logged out and redirected to a login page.</p>
              <p>Then click the "Don't remember your password?" link.</p>
              <p>Enter your email and press "Send Email" button.</p>
              <p>You will receive an email with reset information.</p>
              <p>Follow them to finalize your password change.</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="red" type="button" inverted onClick={() => setModalOpen(false)}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green" type="button" inverted onClick={() => AuthService.signOut()}>
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
        <Header as="h1">
          Sync CRM
          <Header.Subheader>Perform CRM sync</Header.Subheader>
        </Header>

        <Button color="green" type="button" inverted onClick={() => dispatch(syncPending())} loading={isSyncing} disabled={isSyncing}>
          <Icon name="sync" /> Sync Now
        </Button>

        {syncResponse && syncResponse.ok && (
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
      {multiUser && isAdmin && <InviteTeammatesForm settingsPage={true} />}

      {renderPasswordChange()}

      {multiUser && isAdmin && renderSyncCRM()}
    </Page>
  );
};

export default SettingsPage;
