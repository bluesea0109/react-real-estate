import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Header } from 'semantic-ui-react';

import AuthService from '../services/auth';
import { Page, Segment, Button, Modal, Icon, Image } from '../components/Base';
import InviteTeammatesForm from '../components/Forms/InviteTeammatesForm';

const SettingsPage = () => {
  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
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
          Sync CRM - WIP
          <Header.Subheader>Perform CRM sync</Header.Subheader>
        </Header>

        <Button>Sync CRM</Button>
      </Segment>
    );
  };

  return (
    <Page basic>
      {isAdmin && <InviteTeammatesForm settingsPage={true} />}

      {renderPasswordChange()}

      {isAdmin && renderSyncCRM()}
    </Page>
  );
};

export default SettingsPage;
