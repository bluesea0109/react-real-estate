import React from 'react';
import { Button, Header, Icon, Modal } from './Base';

const MailoutEditModal = ({ modalOpen, handleClose }) => (
  <Modal open={modalOpen} onClose={handleClose} basic size="small">
    <Header icon="browser" content="Cookies policy" />
    <Modal.Content>
      <h3>Edit Campaign Details is still under construction...</h3>
    </Modal.Content>
    <Modal.Actions>
      <Button color="green" onClick={handleClose} inverted>
        <Icon name="checkmark" /> Got it
      </Button>
    </Modal.Actions>
  </Modal>
);

export default MailoutEditModal;
