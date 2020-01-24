import { Form, Header } from 'semantic-ui-react';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { inviteUsersPending, skipInviteUsers } from '../../store/modules/inviteUsers/actions';
import { Divider, List, Segment, Item, Icon, Button, Message, Image } from '../Base';
import { objectIsEmpty } from './helpers';

const Checkbox = ({ disabled, label, isSelected, onCheckboxChange }) => (
  <input disabled={disabled} type="checkbox" name={label} checked={isSelected} onChange={onCheckboxChange} />
);

const ProfileCompleted = (
  <Item.Header style={{ color: 'teal' }}>
    <Icon name="check" />
    Profile Completed
  </Item.Header>
);

const UserVerified = (
  <Item.Header style={{ color: 'orange' }}>
    <Icon name="hourglass" />
    Email Verified
  </Item.Header>
);

const PendingInvitation = (
  <Item.Header style={{ color: 'gray' }}>
    <Icon name="hourglass start" />
    Pending Invitation
  </Item.Header>
);

const resolveInvitationStatus = type => {
  const types = {
    verified: UserVerified,
    pending: PendingInvitation,
    completed: ProfileCompleted,
    undefined: 0,
  };
  return type ? types[type] : types['undefined'];
};

const InviteTeammatesForm = ({ settingsPage = null }) => {
  const dispatch = useDispatch();
  const teammates = useSelector(store => store.team.profiles);
  const isInviteUsersPending = useSelector(store => store.inviteUsers.pending);

  const [sendDisabled, setSendDisabled] = useState(true);
  const [onlyOnce, setOnlyOnce] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);

  const profiles = {};

  teammates &&
    teammates.map(profile => {
      const emailClicked = profile.doc && profile.doc.brivitySync.emailClicked;
      const isAdmin = profile.permissions.teamAdmin;

      if (emailClicked || isAdmin) return null;

      return (profiles[profile.userId] = false);
    });

  if (!onlyOnce && !objectIsEmpty(profiles)) {
    setOnlyOnce(true);
    setCheckboxes(profiles);
  }

  useEffect(() => {
    const usersToInvite = [];

    Object.keys(checkboxes)
      .filter(checkbox => checkboxes[checkbox])
      .forEach(checkbox => {
        usersToInvite.push(checkbox);
      });

    if (usersToInvite.length === 0) {
      setSendDisabled(true);
    } else {
      setSendDisabled(false);
    }
  }, [checkboxes, setSendDisabled]);

  const selectAllCheckboxes = isSelected => {
    Object.keys(checkboxes).forEach(checkbox => {
      setCheckboxes(prevState => ({
        ...prevState,
        [checkbox]: isSelected,
      }));
    });
  };

  const selectAll = () => selectAllCheckboxes(true);
  const deselectAll = () => selectAllCheckboxes(false);

  const handleCheckboxChange = changeEvent => {
    const { name } = changeEvent.target;
    const newState = {
      ...checkboxes,
      [name]: !checkboxes[name],
    };
    setCheckboxes(newState);
  };

  const handleSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    const usersToInvite = [];

    Object.keys(checkboxes)
      .filter(checkbox => checkboxes[checkbox])
      .forEach(checkbox => {
        usersToInvite.push(checkbox);
      });

    dispatch(inviteUsersPending({ peers: usersToInvite }));
  };

  const handleContinue = () => {
    dispatch(skipInviteUsers());
  };

  const createInviteField = profile => {
    const userId = profile.userId;
    const userEmail = profile.doc.email;
    const userFullName = `${profile.first} ${profile.last}`;
    const emailInviteSent = profile.doc && profile.doc.brivitySync.emailInviteSent;
    const emailClicked = profile.doc && profile.doc.brivitySync.emailClicked;
    const isAdmin = profile.permissions.teamAdmin;
    const setupComplete = profile.doc && profile.doc.setupComplete;

    let inviationStatus;
    if (emailInviteSent) inviationStatus = resolveInvitationStatus('pending');
    if (isAdmin) inviationStatus = resolveInvitationStatus('pending');
    if (emailClicked) inviationStatus = resolveInvitationStatus('verified');
    if (setupComplete) inviationStatus = resolveInvitationStatus('completed');

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
              <Checkbox disabled={emailClicked} label={userId} isSelected={emailClicked} onCheckboxChange={handleCheckboxChange} key={userEmail} />
            ) : isAdmin ? (
              <Checkbox disabled={isAdmin} label={userId} isSelected={isAdmin} onCheckboxChange={handleCheckboxChange} key={userEmail} />
            ) : (
              <Checkbox label={userId} isSelected={checkboxes[userId]} onCheckboxChange={handleCheckboxChange} key={userEmail} />
            )}
          </div>

          <List.Content style={{ gridArea: 'InviteUserInfo' }}>
            <List.Header>{userFullName}</List.Header>
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
  };

  const createInviteList = () =>
    teammates &&
    teammates
      .sort(function(a, b) {
        const nameA = a.first.toUpperCase();
        const nameB = b.first.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      })
      .map(createInviteField);

  return (
    <Segment>
      <Header as="h1">
        Invite Users
        <Header.Subheader>Send invitations to team members to start using Brivity Marketer (for Brivity Platform users only).</Header.Subheader>
      </Header>

      {teammates && teammates.length === 1 ? (
        <div>
          <Message size="large" style={{ textAlign: 'center' }}>
            <Message.Header>You currently have no team members.</Message.Header>
            <br />
            <Image src={require('../../assets/undraw_selecting_team_8uux.png')} style={{ margin: 'auto', maxWidth: '500px' }} />
            <p>When you get others on your team, check the Settings section in the app to invite them.</p>
          </Message>
          <div style={{ display: 'grid', justifyContent: 'end' }}>
            <div>
              <Button primary type="button" onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', justifyContent: 'start' }}>
            <div>
              <Button primary inverted type="button" onClick={selectAll}>
                Select All
              </Button>
              <Button primary inverted type="button" onClick={deselectAll}>
                Deselect All
              </Button>
            </div>
          </div>

          <List>{createInviteList()}</List>

          <div style={{ display: 'grid', justifyContent: 'end' }}>
            <div>
              <Button primary type="submit" loading={isInviteUsersPending} disabled={sendDisabled || isInviteUsersPending}>
                Send
              </Button>
              {!settingsPage && (
                <Button primary type="button" loading={isInviteUsersPending} onClick={handleContinue} disabled={isInviteUsersPending}>
                  Skip
                </Button>
              )}
            </div>
          </div>
        </Form>
      )}
    </Segment>
  );
};

export default InviteTeammatesForm;
