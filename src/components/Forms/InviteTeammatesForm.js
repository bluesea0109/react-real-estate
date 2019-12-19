import { Form, Header } from 'semantic-ui-react';
import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form as FinalForm, Field } from 'react-final-form';

import { setCompletedInviteTeammates, setOnboardedStatus } from '../../store/modules/onboarded/actions';
import { inviteUsersPending } from '../../store/modules/inviteUsers/actions';
import { Divider, List, Segment, Item, Icon, Button } from '../Base';
import './checkbox.css';

const InviteTeammatesForm = () => {
  const [toInvite, setToInvite] = useState([]);
  const [onlyOnce, setOnlyOnce] = useState(false);
  const dispatch = useDispatch();
  const teammates = useSelector(store => store.team.profiles);

  const listOfUsersToInvite = [];

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

  const handleContinue = () => {
    dispatch(setCompletedInviteTeammates(true));
    dispatch(setOnboardedStatus(true));
  };

  const profiles =
    teammates &&
    teammates.map(profile => {
      const userId = profile.userId;
      const emailInviteSent = profile.doc && profile.doc.brivitySync.emailInviteSent;
      const emailClicked = profile.doc && profile.doc.brivitySync.emailClicked;
      const isAdmin = profile.permissions.teamAdmin;

      let inviationStatus;
      if (emailInviteSent) inviationStatus = resolveInvitationStatus('pending');
      if (isAdmin) inviationStatus = resolveInvitationStatus('pending');
      if (emailClicked) inviationStatus = resolveInvitationStatus('verified');

      if (!emailClicked && !emailInviteSent && !isAdmin) {
        listOfUsersToInvite.push(userId);
      }

      const toggle = (target, input) => {
        if (input.value.includes(target.value)) {
          const newArr = input.value.filter(val => val !== target.value);
          return input.onChange(newArr);
        } else {
          const newArr = input.value;
          newArr.push(target.value);
          setToInvite(newArr);
          return input.onChange(newArr);
        }
      };

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
              {emailClicked ? (
                <Field disabled={emailClicked} checked={emailClicked} name="peers" component="input" type="checkbox" value={userId} />
              ) : isAdmin ? (
                <Field disabled={isAdmin} checked={isAdmin} name="peers" component="input" type="checkbox" value={userId} />
              ) : (
                <Field name="peers">
                  {props => (
                    <input
                      {...props.input}
                      name={props.input.name}
                      checked={props.input.value.includes(userId)}
                      type="checkbox"
                      value={userId}
                      onChange={event => toggle(event.target, props.input)}
                    />
                  )}
                </Field>
              )}
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

  if (teammates.length > 0 && !onlyOnce) {
    setOnlyOnce(true);
    setToInvite(listOfUsersToInvite);
  }

  return (
    <Fragment>
      <Segment>
        <Header as="h1">
          Invite Users
          <Header.Subheader>Send invitations to team members to start using Brivity Marketer (for Brivity Platform users only).</Header.Subheader>
        </Header>

        <FinalForm
          onSubmit={onSubmit}
          initialValues={{ peers: toInvite }}
          render={({ handleSubmit, submitting }) => (
            <Form onSubmit={handleSubmit}>
              <List>{profiles}</List>

              <div style={{ display: 'grid', justifyContent: 'end' }}>
                <div>
                  <Button color="teal" type="submit" disabled={submitting}>
                    Send
                  </Button>
                  <Button color="teal" type="button" onClick={handleContinue}>
                    Continue
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
