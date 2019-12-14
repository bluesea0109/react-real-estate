import React, { Fragment } from 'react';
import { Form, Header } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { Form as FinalForm, Field } from 'react-final-form';

import { inviteUsersPending } from '../../store/modules/inviteUsers/actions';
import { Divider, List, Segment, Item, Icon, Button } from '../Base';
import './checkbox.css';

const InviteTeammatesForm = () => {
  const dispatch = useDispatch();
  const teammates = useSelector(store => store.team.profiles);

  const UserVerified = (
    <Item.Header style={{ color: 'teal' }}>
      <Icon name="check" />
      Verified
    </Item.Header>
  );

  const PendingInvitation = (
    <Item.Header style={{ color: 'gray' }}>
      <Icon name="hourglass one" />
      Pending invitation
    </Item.Header>
  );

  const resolveInvitationStatus = type => {
    const types = {
      verified: UserVerified,
      pending: PendingInvitation,
      undefined: 0,
    };
    return type ? types[type] : types['undefined'];
  };

  const onSubmit = values => {
    dispatch(inviteUsersPending(values));
  };

  const profiles =
    teammates &&
    teammates.map(profile => {
      const email = profile.doc.email;
      const emailInviteSent = profile.doc && profile.doc.brivitySync.emailInviteSent;
      const emailClicked = profile.doc && profile.doc.brivitySync.emailClicked;

      let inviationStatus;
      if (emailInviteSent) inviationStatus = resolveInvitationStatus('pending');
      if (emailClicked) inviationStatus = resolveInvitationStatus('verified');

      return (
        <Fragment key={profile.doc.email}>
          <Divider style={{ margin: '-2px -1em 1em -1em' }} />
          <List.Item
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1em 16em 22em auto',
              gridTemplateRows: '1fr',
              gridTemplateAreas: `"InviteCheckbox InviteUserInfo InviteStatus InviteSpace"`,
              gridColumnGap: '1em',

              alignItems: 'center',
            }}
          >
            <div style={{ gridArea: 'InviteCheckbox' }}>
              <Field disabled={emailClicked} checked={emailClicked} name="peers" component="input" type="checkbox" value={email} />
            </div>

            <List.Content style={{ gridArea: 'InviteUserInfo' }}>
              <List.Header>
                {profile.first} {profile.last}
              </List.Header>
              <List.Description>{profile.doc.email}</List.Description>
            </List.Content>

            <Item style={{ gridArea: 'InviteStatus' }}>
              <Item.Content verticalAlign="middle">{inviationStatus}</Item.Content>
            </Item>

            <div style={{ gridArea: 'InviteSpace' }} />
          </List.Item>
          <Divider style={{ margin: '1em -1em -2px -1em' }} />
        </Fragment>
      );
    });

  return (
    <Fragment>
      <Segment>
        <Header as="h1">
          Invite Users
          <Header.Subheader>Send invitations to team members to start using Brivity Marketer (for Brivity Platform users only).</Header.Subheader>
        </Header>

        <FinalForm
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <Form onSubmit={handleSubmit}>
              <List>{profiles}</List>

              <div style={{ display: 'grid', justifyContent: 'end' }}>
                <div>
                  <Button color="teal" type="submit" disabled={submitting || pristine}>
                    Send
                  </Button>
                </div>
              </div>
            </Form>
          )}
        />
      </Segment>
    </Fragment>
  );
};

export default InviteTeammatesForm;
