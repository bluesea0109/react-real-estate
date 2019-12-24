import React from 'react';
import { connect } from 'react-redux';
import { Button, Container, Divider, Header, Icon, Modal, Message, Segment } from './Base';

import CustomizeCampaignForm from './Forms/CustomizeCampaignForm';

const MailoutEditModal = props => {
  const { modalOpen, handleClose } = props;

  return (
    <Modal open={modalOpen} onClose={handleClose} size="small">
      <Modal.Header>
        <Header as="h1">Customize Campaign</Header>
        <Header as="h4">Make changes to this specific postcard campaign.</Header>
      </Modal.Header>
      <Modal.Content>
        <Container>
          <Segment>
            <Divider hidden />
            <CustomizeCampaignForm onSubmit={() => console.log('ProfileForm was submitted')} />
            <Message>
              <Message.Header>Form data:</Message.Header>
              <pre>{JSON.stringify(props, null, 2)}</pre>
            </Message>
          </Segment>
        </Container>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" onClick={handleClose} inverted>
          <Icon name="checkmark" /> Got it
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

// const mapStateToProps = state => {
//   return state.form.customizeCampaign
//     ? {
//         values: state.form.customizeCampaign.values,
//         submitSucceeded: state.form.customizeCampaign.submitSucceeded,
//       }
//     : {};
// };
//
// export default connect(mapStateToProps)(MailoutEditModal);
