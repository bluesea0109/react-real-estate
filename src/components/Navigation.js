import styled from 'styled-components';
import { useHistory } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, Header, Popup } from 'semantic-ui-react';
import React, { createRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { StepLayout, StepsLayout, MobileDisabledLayout, NavigationLayout } from '../layouts';
import { selectPeerId, deselectPeerId } from '../store/modules/peer/actions';
import { Dimmer, Menu, Initials, Icon, Step } from './Base';

import SideNaveToggle from './SideNaveToggle';
import './SideNaveToggle/styles.scss';

const smallIconWithTextStyle = {
  margin: '0 .5em 0 -.6em',
  width: '15px',
};

const noIconTextStyle = {
  margin: '0 0.5em 0 4.4em',
};

const sidebarTextStyle = {
  fontSize: '1em',
  width: '100%',
  marginLeft: '-.5em',
  backgroundColor: 'white',
};

const menuItemStyles = {
  lineHeight: 2.6,
  fontSize: '18px',
};

const StyledUserSelectorDropdown = styled(Dropdown)`
  min-width: 8.3em !important;
  max-width: 8.3em !important;
`;

const StyledHeader = styled(Header)`
  min-width: max-content !important;
  display: inline-block;
`;

const mql = window.matchMedia('(max-width: 599px)');
const menuSpacing = () => (mql.matches ? {} : { marginLeft: '.5em' });
const isMobile = () => mql.matches;

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [activeUser, setActiveUser] = useState('');
  const [appIsBusy, setAppIsBusy] = useState(false);
  const [dropdown, setDropdown] = useState('');
  const [moblileVisible, setMobileVisible] = React.useState(false);

  const isAuthenticated = useSelector(store => store.auth0.authenticated);
  const onLoginPending = useSelector(store => store.onLogin.pending);
  const onLoginError = useSelector(store => store.onLogin.error && store.onLogin.error.message);
  const onboarded = useSelector(store => store.onboarded.status);

  const templatesAvailable = useSelector(store => store.templates.available);
  const statesAvailable = useSelector(store => store.states.available);
  const boardsAvailable = useSelector(store => store.boards.available);
  const loadingCompleted = !!isAuthenticated && !!templatesAvailable && !!statesAvailable && !!boardsAvailable && !onLoginError && !onLoginPending;

  const completedProfile = useSelector(store => store.onboarded.completedProfile);
  const completedTeamCustomization = useSelector(store => store.onboarded.completedTeamCustomization);
  const completedCustomization = useSelector(store => store.onboarded.completedCustomization);
  const completedInviteTeammates = useSelector(store => store.onboarded.completedInviteTeammates);

  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';
  // const singleUser = onLoginMode === 'singleuser';

  const isAdmin = useSelector(store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin);
  const loggedInUser = useSelector(store => store.onLogin.user);
  const selectedPeerId = useSelector(store => store.peer.peerId);
  const teammates = useSelector(store => store.team.profiles);

  const mailoutPendingState = useSelector(store => store.mailout.pending);
  const updateMailoutEditPendingState = useSelector(store => store.mailout.updateMailoutEditPending);
  const mailoutSubmitPendingState = useSelector(store => store.mailout.submitPending);
  const mailoutStopPendingState = useSelector(store => store.mailout.stopPending);
  const mailoutUpdateMailoutSizePendingState = useSelector(store => store.mailout.updateMailoutSizePending);

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
      const currentUserIconWithPopup = <Popup context={contextRef} content="Currently logged in user" trigger={<Icon name="user" />} />;
      const setupCompletedIconWithPopup = <Popup context={contextRef} content="Setup Completed" trigger={<Icon name="check circle" color="teal" />} />;

      return profiles.push({
        key: index,
        text: profile.first,
        value: profile.userId,
        content: (
          <StyledHeader as="h4" ref={contextRef}>
            <Initials firstName={profile.first} lastName={profile.last} />
            &nbsp; &nbsp;
            {profile.first}&nbsp;
            {profile.last}&nbsp;
            {profile.permissions && profile.permissions.teamAdmin ? '(Admin)' : '(Agent)'}&nbsp;
            {currentUser ? currentUserIconWithPopup : null}
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
      if (
        location.pathname !== '/profile' &&
        location.pathname !== '/dashboard' &&
        location.pathname !== '/customization' &&
        location.pathname !== '/settings' &&
        location.pathname !== '/dashboard/archived'
      ) {
        history.push(`/dashboard`);
      }
    } else if (loggedInUser && activeUser === loggedInUser._id && selectedPeerId) {
      dispatch(deselectPeerId());
      if (
        location.pathname !== '/profile' &&
        location.pathname !== '/dashboard' &&
        location.pathname !== '/customization' &&
        location.pathname !== '/settings' &&
        location.pathname !== '/dashboard/archived'
      ) {
        history.push(`/dashboard`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUser, activeUser, selectedPeerId, dispatch, history]);

  useEffect(() => {
    const busyState =
      mailoutPendingState || updateMailoutEditPendingState || mailoutSubmitPendingState || mailoutStopPendingState || mailoutUpdateMailoutSizePendingState;
    setAppIsBusy(busyState);
  }, [mailoutPendingState, updateMailoutEditPendingState, mailoutSubmitPendingState, mailoutStopPendingState, mailoutUpdateMailoutSizePendingState]);

  const renderLabel = label => ({
    color: 'blue',
    content: `${label.text2}`,
  });

  const handleProfileSelect = (e, { value }) => setActiveUser(value);

  const onProfile = !completedProfile;
  const onTeamCustomization = !completedTeamCustomization && completedProfile;
  const onCustomization = !completedCustomization && completedTeamCustomization && completedProfile;
  const onInviteTeammates = !completedInviteTeammates && completedCustomization && completedTeamCustomization && completedProfile;

  const onProfileSingleUser = !completedProfile;
  const onCustomizationSingleUser = !completedCustomization && completedProfile;

  if (!loadingCompleted) return null;

  if (loadingCompleted && !onboarded) {
    if (multiUser && isAdmin) {
      return (
        <StepsLayout vertical={!mql.matches}>
          <StepLayout active={onProfile} completed={completedProfile}>
            <Icon name="user" />
            {mql.matches ? null : (
              <Step.Content>
                <Step.Title style={sidebarTextStyle}>Fill in your profile</Step.Title>
              </Step.Content>
            )}
          </StepLayout>

          <StepLayout active={onTeamCustomization} completed={completedTeamCustomization}>
            <Icon name="paint brush" />
            {mql.matches ? null : (
              <Step.Content>
                <Step.Title style={sidebarTextStyle}>Customize Team</Step.Title>
              </Step.Content>
            )}
          </StepLayout>

          <StepLayout active={onCustomization} completed={completedCustomization}>
            <Icon name="paint brush" />
            {mql.matches ? null : (
              <Step.Content>
                <Step.Title style={sidebarTextStyle}>Customize</Step.Title>
              </Step.Content>
            )}
          </StepLayout>

          <StepLayout active={onInviteTeammates} completed={completedInviteTeammates}>
            <Icon name="cog" />
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
            <Icon name="user" />
            {mql.matches ? null : (
              <Step.Content>
                <Step.Title style={sidebarTextStyle}>Fill in your profile</Step.Title>
              </Step.Content>
            )}
          </StepLayout>

          <StepLayout active={onCustomizationSingleUser} completed={completedCustomization}>
            <Icon name="paint brush" />
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

  const mobileCollapse = () => {
    if (moblileVisible) {
      setMobileVisible(false);
    }
  };

  return (
    <SideNaveToggle moblileVisible={moblileVisible} setMobileVisible={setMobileVisible}>
      <Dimmer.Dimmable blurring dimmed={appIsBusy}>
        <Dimmer active={appIsBusy} inverted />

        <NavigationLayout
          text
          style={
            isMobile()
              ? {
                  WebkitBoxShadow: '2px 2px 6px 0px rgba(50, 50, 50, 0.14)',
                  MozBoxShadow: '2px 2px 6px 0px rgba(50, 50, 50, 0.14)',
                  BoxShadow: '2px 2px 6px 0px rgba(50, 50, 50, 0.14)',
                  backgroundColor: 'white',
                  height: '100vh',
                }
              : {}
          }
        >
          {multiUser && (
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
          <div
            onMouseEnter={() => {
              setDropdown('accordionDrop');
            }}
            onMouseLeave={() => {
              setDropdown('');
            }}
            onClick={mobileCollapse}
          >
            <Menu.Item as={Link} color="teal" name="dashboard" active={activeItem === '/dashboard'} to="/dashboard" style={menuItemStyles}>
              <MobileDisabledLayout>
                <FontAwesomeIcon icon="tachometer-alt" className="iconWithStyle" /> Dashboard{' '}
                <FontAwesomeIcon icon="caret-down" style={{ marginLeft: '0.2em' }} />
              </MobileDisabledLayout>
            </Menu.Item>
          </div>
          <div
            className={isMobile() ? 'accordionDrop' : `noDropdown ${dropdown}`}
            onMouseEnter={() => {
              setDropdown('accordionDrop');
            }}
            onMouseLeave={() => {
              setDropdown('');
            }}
          >
            <Menu.Item
              as={Link}
              color="teal"
              name="archived"
              active={activeItem === '/dashboard/archived'}
              to="/dashboard/archived"
              style={menuItemStyles}
              onClick={mobileCollapse}
            >
              <MobileDisabledLayout style={noIconTextStyle}>
                <FontAwesomeIcon icon="archive" style={smallIconWithTextStyle} /> Archive
              </MobileDisabledLayout>
            </Menu.Item>
          </div>
          <Menu.Item
            as={Link}
            color="teal"
            name="customization"
            active={activeItem === '/customization'}
            to="/customization"
            style={menuItemStyles}
            onClick={mobileCollapse}
          >
            <MobileDisabledLayout>
              <FontAwesomeIcon icon="paint-brush" className="iconWithStyle" /> Customization{' '}
              {multiUser && isAdmin && !selectedPeerId && <FontAwesomeIcon icon="caret-down" style={{ marginLeft: '0.2em' }} />}
            </MobileDisabledLayout>
          </Menu.Item>

          {multiUser && isAdmin && !selectedPeerId && location.pathname.includes('/customization') && (
            <Menu.Menu style={{ marginTop: !isMobile() ? '-1.2em' : '' }}>
              <Menu.Item
                as={Link}
                color="teal"
                name="customization/team"
                active={activeItem === '/customization/team'}
                to="/customization/team"
                style={{ lineHeight: 2.6 }}
                onClick={mobileCollapse}
              >
                <MobileDisabledLayout style={noIconTextStyle}>
                  <FontAwesomeIcon icon="users" style={smallIconWithTextStyle} /> Team
                </MobileDisabledLayout>
              </Menu.Item>
            </Menu.Menu>
          )}

          <Menu.Item as={Link} color="teal" name="profile" active={activeItem === '/profile'} to="/profile" style={menuItemStyles} onClick={mobileCollapse}>
            <MobileDisabledLayout>
              <FontAwesomeIcon icon="user" className="iconWithStyle" /> Profile
            </MobileDisabledLayout>
          </Menu.Item>
          <Menu.Item as={Link} color="teal" name="settings" active={activeItem === '/settings'} to="/settings" style={menuItemStyles} onClick={mobileCollapse}>
            <MobileDisabledLayout>
              <FontAwesomeIcon icon="cog" className="iconWithStyle" /> Settings
            </MobileDisabledLayout>
          </Menu.Item>
          {!selectedPeerId && (
            <Menu.Item
              as={Link}
              color="teal"
              name="billing"
              active={activeItem === '/billing'}
              to="/billing"
              style={menuItemStyles}
              onClick={() => {
                if (moblileVisible) {
                  setMobileVisible(false);
                }
              }}
            >
              <MobileDisabledLayout>
                <FontAwesomeIcon icon="credit-card" className="iconWithStyle" /> Billing
              </MobileDisabledLayout>
            </Menu.Item>
          )}
        </NavigationLayout>
      </Dimmer.Dimmable>
    </SideNaveToggle>
  );
};
