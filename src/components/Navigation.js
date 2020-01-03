import styled from 'styled-components';
import { useHistory } from 'react-router';
import React, { createRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, Header, Popup } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { StepLayout, StepsLayout, NavigationLayout, MobileDisabledLayout, MobileEnabledLayout } from '../layouts';
import { selectPeerId, deselectPeerId } from '../store/modules/peer/actions';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Image, Icon, Step } from './Base';

import './navigation.css';

const iconOnlyStyle = {
  margin: '0 auto 0 auto',
};

const iconWithTextStyle = {
  margin: '0 .5em 0 2.5em',
};

const sidebarTextStyle = {
  fontSize: '1em',
  marginLeft: '-.5em',
};

const StyledUserSelectorDropdown = styled(Dropdown)`
  min-width: 8.3em !important;
  max-width: 8.3em !important;
`;

const StyledHeader = styled(Header)`
  min-width: 18em;
  display: inline-block;
`;

const StyledCustomizationDropdown = styled(Dropdown)`
  min-width: 8.3em !important;
  max-width: 8.3em !important;
`;

const mql = window.matchMedia('(max-width: 599px)');
const menuSpacing = () => (mql.matches ? {} : { marginLeft: '2.5em' });

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [activeUser, setActiveUser] = useState('');

  const isAuthenticated = useSelector(store => store.auth0.authenticated);
  const onLoginPending = useSelector(store => store.onLogin.pending);
  const onLoginError = useSelector(store => store.onLogin.error);
  const onboarded = useSelector(store => store.onboarded.status);

  const templatesAvailable = useSelector(store => store.templates.available);
  const statesAvailable = useSelector(store => store.states.available);
  const boardsAvailable = useSelector(store => store.boards.available);
  const loadingCompleted = !!isAuthenticated && !!templatesAvailable && !!statesAvailable && !!boardsAvailable && !onLoginError && !onLoginPending;

  const completedProfile = useSelector(store => store.onboarded.completedProfile);
  const completedTeamCustomization = useSelector(store => store.onboarded.completedTeamCustomization);
  const completedCustomization = useSelector(store => store.onboarded.completedCustomization);
  const completedInviteTeammates = useSelector(store => store.onboarded.completedInviteTeammates);

  const isMultimode = useSelector(store => store.onLogin.mode === 'multiuser');

  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const loggedInUser = useSelector(store => store.onLogin.user);
  const selectedPeerId = useSelector(store => store.peer.peerId);
  const teammates = useSelector(store => store.team.profiles);
  const profiles = [];

  useEffect(() => {
    // TODO: Add google page tracking
    // ga.send(["pageview", location.pathname]);
    setActiveItem(location.pathname);
  }, [location]);

  if (teammates.length > 0) {
    teammates.map((profile, index) => {
      const setupComplete = profile.doc.setupComplete;
      const currentUser = profile.userId === loggedInUser._id;
      // const userEmail = profile.doc.email;

      const contextRef = createRef();
      const adminIconWithPopup = <Popup context={contextRef} content="Admin" trigger={<Icon name="legal" />} />;
      const agentIconWithPopup = <Popup context={contextRef} content="Agent" trigger={<Icon name="detective" />} />;
      const currentUserIconWithPopup = <Popup context={contextRef} content="Currently logged in user" trigger={<Icon name="user" />} />;
      const setupCompletedIconWithPopup = <Popup context={contextRef} content="Setup Completed" trigger={<Icon name="check circle" color="teal" />} />;

      return profiles.push({
        key: index,
        text: profile.last,
        value: profile.userId,
        content: (
          <StyledHeader as="h4" ref={contextRef}>
            <Image size="mini" inline circular src="https://react.semantic-ui.com/images/avatar/large/patrick.png" />
            &nbsp;
            {profile.first}&nbsp;
            {profile.last}&nbsp;
            {currentUser ? currentUserIconWithPopup : null}
            {profile.permissions && profile.permissions.teamAdmin ? adminIconWithPopup : agentIconWithPopup}
            {setupComplete ? setupCompletedIconWithPopup : null}
          </StyledHeader>
        ),
      });
    });
  }

  useEffect(() => {
    if (loggedInUser && !activeUser) {
      setActiveUser(loggedInUser._id);
    } else if (loggedInUser && activeUser !== loggedInUser._id) {
      dispatch(selectPeerId(activeUser));
      if (location.pathname !== '/profile' && location.pathname !== '/dashboard') {
        history.push(`/dashboard`);
      }
    } else if (loggedInUser && activeUser === loggedInUser._id && selectedPeerId) {
      dispatch(deselectPeerId());
      if (location.pathname !== '/profile' && location.pathname !== '/dashboard') {
        history.push(`/dashboard`);
      }
    }
  }, [loggedInUser, activeUser, selectedPeerId, dispatch, history, location]);

  const renderLabel = label => ({
    color: 'blue',
    content: `${label.text2}`,
  });

  const handleProfileSelect = (e, { value }) => setActiveUser(value);

  const handleCustomizationDropdown = (e, { value }) => {
    // console.log('handleCustomizationDropdown');
    // console.log('value: ', value);
    // return setActiveCustomizationItem(value);
  };

  const renderCustomizationDropdown = () => {
    if (mql.matches) {
      return (
        <span style={{ display: 'inline-flex' }}>
          <FontAwesomeIcon icon="paint-brush" style={{ marginLeft: '0.5em', marginRight: '-0.5em' }} />
          <Dropdown floating>
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                text="Team Default"
                value="team"
                onClick={handleCustomizationDropdown}
                to="/customization/team"
                active={activeItem === '/customization/team'}
              />
              <Dropdown.Item
                as={Link}
                text="My Defaults"
                value="mine"
                onClick={handleCustomizationDropdown}
                to="/customization"
                active={activeItem === '/customization'}
              />
            </Dropdown.Menu>
          </Dropdown>
        </span>
      );
    } else {
      return (
        <span>
          <FontAwesomeIcon icon="paint-brush" style={iconWithTextStyle} />
          <StyledCustomizationDropdown floating text="Customization">
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                text="Team Default"
                value="team"
                onClick={handleCustomizationDropdown}
                to="/customization/team"
                active={activeItem === '/customization/team'}
              />
              <Dropdown.Item
                as={Link}
                text="My Defaults"
                value="mine"
                onClick={handleCustomizationDropdown}
                to="/customization"
                active={activeItem === '/customization'}
              />
            </Dropdown.Menu>
          </StyledCustomizationDropdown>
        </span>
      );
    }
  };

  const onProfile = !completedProfile;
  const onTeamCustomization = !completedTeamCustomization && completedProfile;
  const onCustomization = !completedCustomization && completedTeamCustomization && completedProfile;
  const onInviteTeammates = !completedInviteTeammates && completedCustomization && completedTeamCustomization && completedProfile;

  const onProfileSingleUser = !completedProfile;
  const onCustomizationSingleUser = !completedCustomization && completedProfile;

  if (!loadingCompleted) return null;

  if (loadingCompleted && !onboarded) {
    if (isMultimode && isAdmin) {
      return (
        <StepsLayout vertical={!mql.matches}>
          <StepLayout active={onProfile} completed={completedProfile}>
            <Icon name="edit" />
            {mql.matches ? null : (
              <Step.Content>
                <Step.Title style={sidebarTextStyle}>Fill in your profile</Step.Title>
              </Step.Content>
            )}
          </StepLayout>

          <StepLayout active={onTeamCustomization} completed={completedTeamCustomization}>
            <Icon name="cogs" />
            {mql.matches ? null : (
              <Step.Content>
                <Step.Title style={sidebarTextStyle}>Customize Team</Step.Title>
              </Step.Content>
            )}
          </StepLayout>

          <StepLayout active={onCustomization} completed={completedCustomization}>
            <Icon name="cog" />
            {mql.matches ? null : (
              <Step.Content>
                <Step.Title style={sidebarTextStyle}>Customize</Step.Title>
              </Step.Content>
            )}
          </StepLayout>

          <StepLayout active={onInviteTeammates} completed={completedInviteTeammates}>
            <Icon name="paper plane" />
            {mql.matches ? null : (
              <Step.Content>
                <Step.Title style={sidebarTextStyle}>Invite Teammates</Step.Title>
              </Step.Content>
            )}
          </StepLayout>
        </StepsLayout>
      );
    } else {
      return (
        <StepsLayout vertical={!mql.matches}>
          <StepLayout active={onProfileSingleUser} completed={completedProfile}>
            <Icon name="edit" />
            {mql.matches ? null : (
              <Step.Content>
                <Step.Title style={sidebarTextStyle}>Fill in your profile</Step.Title>
              </Step.Content>
            )}
          </StepLayout>

          <StepLayout active={onCustomizationSingleUser} completed={completedCustomization}>
            <Icon name="cog" />
            {mql.matches ? null : (
              <Step.Content>
                <Step.Title style={sidebarTextStyle}>Customize</Step.Title>
              </Step.Content>
            )}
          </StepLayout>
        </StepsLayout>
      );
    }
  }

  return (
    <NavigationLayout text>
      {isMultimode && (
        <Menu.Item style={menuSpacing()}>
          <StyledUserSelectorDropdown
            search
            floating
            scrolling
            selection
            options={profiles}
            onChange={handleProfileSelect}
            value={activeUser}
            renderLabel={renderLabel}
          />
        </Menu.Item>
      )}

      <Menu.Item as={Link} color="teal" name="dashboard" active={activeItem === '/dashboard'} to="/dashboard">
        <MobileEnabledLayout style={iconOnlyStyle}>
          <FontAwesomeIcon icon="tachometer-alt" />
        </MobileEnabledLayout>
        <MobileDisabledLayout>
          <FontAwesomeIcon icon="tachometer-alt" style={iconWithTextStyle} /> Dashboard
        </MobileDisabledLayout>
      </Menu.Item>
      {isMultimode && isAdmin && !selectedPeerId ? (
        <Menu.Item color="teal" name="customization" active={activeItem === '/customization'}>
          {renderCustomizationDropdown()}
        </Menu.Item>
      ) : (
        <Menu.Item as={Link} color="teal" name="customization" active={activeItem === '/customization'} to="/customization">
          <MobileEnabledLayout style={iconOnlyStyle}>
            <FontAwesomeIcon icon="paint-brush" />
          </MobileEnabledLayout>
          <MobileDisabledLayout>
            <FontAwesomeIcon icon="paint-brush" style={iconWithTextStyle} /> Customization
          </MobileDisabledLayout>
        </Menu.Item>
      )}
      <Menu.Item as={Link} color="teal" name="profile" active={activeItem === '/profile'} to="/profile">
        <MobileEnabledLayout style={iconOnlyStyle}>
          <FontAwesomeIcon icon="user" />
        </MobileEnabledLayout>
        <MobileDisabledLayout>
          <FontAwesomeIcon icon="user" style={iconWithTextStyle} /> Profile
        </MobileDisabledLayout>
      </Menu.Item>
      <Menu.Item as={Link} color="teal" name="settings" active={activeItem === '/settings'} to="/settings">
        <MobileEnabledLayout style={iconOnlyStyle}>
          <FontAwesomeIcon icon="cog" />
        </MobileEnabledLayout>
        <MobileDisabledLayout>
          <FontAwesomeIcon icon="cog" style={iconWithTextStyle} /> Settings
        </MobileDisabledLayout>
      </Menu.Item>
    </NavigationLayout>
  );
};
