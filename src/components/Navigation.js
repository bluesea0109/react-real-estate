import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Header, Popup } from 'semantic-ui-react';
import React, { createRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';
import { resetMailout } from '../store/modules/mailout/actions';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';

import { StepLayout, StepsLayout, NavigationLayout } from '../layouts';
import { Dimmer, Menu, Initials, Icon, Step } from './Base';
import { useIsMobile } from './Hooks/useIsMobile.js';

import SideNavToggle from './SideNavToggle';
import { ReactComponent as Cog } from '../assets/cog.svg';
import { ReactComponent as Icon1 } from '../assets/1-icon.svg';
import { ReactComponent as Icon2 } from '../assets/2-icon.svg';
import { ReactComponent as Icon3 } from '../assets/3-icon.svg';
import { ReactComponent as Icon4 } from '../assets/4-icon.svg';

const sidebarTextStyle = {
  fontSize: '16px',
  width: '100%',
  marginLeft: '16px',
  marginTop: '-3px',
};

const menuItemStyles = {
  lineHeight: 2.6,
  fontSize: '16px',
  height: '56px',
  borderBottom: '1px solid #eaedf0 !important',
  padding: '0.5em',
};

const subMenuItemStyles = {
  lineHeight: 1,
  fontSize: '14px',
  paddingLeft: '40px',
  paddingTop: '4px',
  paddingBottom: '10px',
};

const subMenuItemBillingStyle = {
  lineHeight: 1,
  fontSize: '14px',
  paddingLeft: '40px',
  paddingBottom: '18px',
};

const StyledHeader = styled(Header)`
  min-width: max-content !important;
  display: inline-block;
`;

const menuP = {
  lineHeight: '2.6',
  fontSize: '40px !important',
  height: '56px',
  padding: '0.5em',
  marginLeft: '16px',
  marginTop: '-2px',
};

const StyledCog = styled(Cog)`
  width: 15px;
  height: 20px;
  margin-left: 14px;
  margin-top: 17px;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin: 0em 1em 0em 0.65em;
`;

const ArchiveStyledIcon = styled(FontAwesomeIcon)`
  margin: 0em 1.3em 0em 0.65em;
`;

const FacebookStyledIcon = styled(FontAwesomeIcon)`
  margin: 0em 1.3em 0em 0.86em;
`;

const ImageStyledIcon = styled(FontAwesomeIcon)`
  margin: 0 1.3rem 0 0.85rem;
`;

export default () => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [appIsBusy, setAppIsBusy] = useState(false);
  const [dropdown, setDropdown] = useState('');
  const [toggle, setToggle] = useState('');
  const [moblileVisible, setMobileVisible] = React.useState(false);
  const [svgHover, setSvgHover] = useState('');

  const isAuthenticated = useSelector(store => store.auth0.authenticated);
  const onLoginPending = useSelector(store => store.onLogin.pending);
  const onLoginError = useSelector(store => store.onLogin.error && store.onLogin.error.message);
  const onboarded = useSelector(store => store.onboarded.status);

  const templatesAvailable = useSelector(store => store.templates.available);
  const statesAvailable = useSelector(store => store.states.available);
  const boardsAvailable = useSelector(store => store.boards.available);
  const loadingCompleted =
    !!isAuthenticated &&
    !!templatesAvailable &&
    !!statesAvailable &&
    !!boardsAvailable &&
    !onLoginError &&
    !onLoginPending;

  const completedProfile = useSelector(store => store.onboarded.completedProfile);
  const completedTeamCustomization = useSelector(
    store => store.onboarded.completedTeamCustomization
  );
  const completedCustomization = useSelector(store => store.onboarded.completedCustomization);
  const completedInviteTeammates = useSelector(store => store.onboarded.completedInviteTeammates);

  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';
  // const singleUser = onLoginMode === 'singleuser';

  const isAdmin = useSelector(
    store => store.onLogin.permissions && store.onLogin.permissions.teamAdmin
  );
  const loggedInUser = useSelector(store => store.onLogin.user);
  const selectedPeerId = useSelector(store => store.peer.peerId);
  const teammates = useSelector(store => store.team.profiles);

  const mailoutPendingState = useSelector(store => store.mailout.pending);
  const updateMailoutEditPendingState = useSelector(
    store => store.mailout.updateMailoutEditPending
  );
  const mailoutSubmitPendingState = useSelector(store => store.mailout.submitPending);
  const mailoutStopPendingState = useSelector(store => store.mailout.stopPending);
  const mailoutUpdateMailoutSizePendingState = useSelector(
    store => store.mailout.updateMailoutSizePending
  );
  const adProduct = useSelector(store => store.onLogin.permissions?.adProduct);

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
      const currentUserIconWithPopup = (
        <Popup
          context={contextRef}
          content="Currently logged in user"
          trigger={<Icon name="user" />}
        />
      );
      const setupCompletedIconWithPopup = (
        <Popup
          context={contextRef}
          content="Setup Completed"
          trigger={<Icon name="check circle" color="teal" />}
        />
      );

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
            {profile.permissions && profile.permissions.teamAdmin ? '(Admin)' : '(Agent)'}
            &nbsp;
            {currentUser ? currentUserIconWithPopup : null}
            {setupComplete ? setupCompletedIconWithPopup : null}
          </StyledHeader>
        ),
      });
    });
  }

  useEffect(() => {
    toggle ? setDropdown('accordionDrop') : setDropdown('');

    const busyState =
      mailoutPendingState ||
      updateMailoutEditPendingState ||
      mailoutSubmitPendingState ||
      mailoutStopPendingState ||
      mailoutUpdateMailoutSizePendingState;
    setAppIsBusy(busyState);
  }, [
    mailoutPendingState,
    updateMailoutEditPendingState,
    mailoutSubmitPendingState,
    mailoutStopPendingState,
    mailoutUpdateMailoutSizePendingState,
    toggle,
  ]);

  const onProfile = !completedProfile;
  const onTeamCustomization = !completedTeamCustomization && completedProfile;
  const onCustomization = !completedCustomization && completedTeamCustomization && completedProfile;
  const onInviteTeammates =
    !completedInviteTeammates &&
    completedCustomization &&
    completedTeamCustomization &&
    completedProfile;

  const onProfileSingleUser = !completedProfile;
  const onCustomizationSingleUser = !completedCustomization && completedProfile;

  if (!loadingCompleted) return null;

  if (loadingCompleted && !onboarded) {
    if (multiUser && isAdmin) {
      return (
        <SideNavToggle
          moblileVisible={moblileVisible}
          setMobileVisible={setMobileVisible}
          toggle={toggle}
          setToggle={setToggle}
        >
          <StepsLayout vertical={!isMobile}>
            <StepLayout active={onProfile} completed={completedProfile}>
              <Icon1 />
              {isMobile ? null : (
                <Step.Content>
                  <Step.Title style={sidebarTextStyle}>Profile</Step.Title>
                </Step.Content>
              )}
            </StepLayout>

            <StepLayout active={onTeamCustomization} completed={completedTeamCustomization}>
              <Icon2 />
              {isMobile ? null : (
                <Step.Content>
                  <Step.Title style={sidebarTextStyle}>Customize Team</Step.Title>
                </Step.Content>
              )}
            </StepLayout>

            <StepLayout active={onCustomization} completed={completedCustomization}>
              <Icon3 />
              {isMobile ? null : (
                <Step.Content>
                  <Step.Title style={sidebarTextStyle}>Customize</Step.Title>
                </Step.Content>
              )}
            </StepLayout>

            <StepLayout active={onInviteTeammates} completed={completedInviteTeammates}>
              <Icon4 />
              {isMobile ? null : (
                <Step.Content>
                  <Step.Title style={sidebarTextStyle}>Invite Teammates</Step.Title>
                </Step.Content>
              )}
            </StepLayout>
          </StepsLayout>
        </SideNavToggle>
      );
    } else {
      return (
        <SideNavToggle
          moblileVisible={moblileVisible}
          setMobileVisible={setMobileVisible}
          toggle={toggle}
          setToggle={setToggle}
        >
          <StepsLayout vertical={!isMobile}>
            <StepLayout active={onProfileSingleUser} completed={completedProfile}>
              <Icon name="user" />
              {isMobile ? null : (
                <Step.Content>
                  <Step.Title style={sidebarTextStyle}>Profile</Step.Title>
                </Step.Content>
              )}
            </StepLayout>

            <StepLayout active={onCustomizationSingleUser} completed={completedCustomization}>
              <Icon name="paint brush" />
              {isMobile ? null : (
                <Step.Content>
                  <Step.Title style={sidebarTextStyle}>Customize</Step.Title>
                </Step.Content>
              )}
            </StepLayout>
          </StepsLayout>
        </SideNavToggle>
      );
    }
  }

  const mobileCollapse = () => {
    dispatch(resetMailout());
    if (moblileVisible) {
      setMobileVisible(false);
    }
  };

  return (
    <SideNavToggle
      moblileVisible={moblileVisible}
      setMobileVisible={setMobileVisible}
      toggle={toggle}
      setToggle={setToggle}
    >
      <Dimmer.Dimmable blurring dimmed={appIsBusy}>
        <Dimmer active={appIsBusy} inverted />

        <NavigationLayout
          text
          style={
            isMobile
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
          <Menu.Item
            as={Link}
            name="dashboard"
            active={activeItem === '/dashboard'}
            to="/dashboard"
            style={menuItemStyles}
            onClick={mobileCollapse}
          >
            <StyledIcon icon="tachometer-alt" className="iconWithStyle" /> Dashboard
          </Menu.Item>

          <Menu.Item
            as={Link}
            name="listings"
            active={activeItem === '/listings'}
            to="/listings"
            style={menuItemStyles}
            onClick={mobileCollapse}
          >
            <StyledIcon icon="home" className="iconWithStyle" /> Listings
          </Menu.Item>

          <Menu.Item
            as={Link}
            name="postcards"
            active={activeItem === '/postcards'}
            to="/postcards"
            style={menuItemStyles}
            onClick={mobileCollapse}
          >
            <ImageStyledIcon icon={faImage} className="imageIconWithStyle" /> Postcards
          </Menu.Item>

          {adProduct && multiUser && (
            <Menu.Item
              as={Link}
              name="ads"
              active={activeItem === '/ads'}
              to="/ads"
              style={menuItemStyles}
              onClick={mobileCollapse}
            >
              <FacebookStyledIcon icon={faFacebookF} className="facebookIconWithStyle" /> Paid Ads
            </Menu.Item>
          )}
          <Menu.Item
            as={Link}
            name="archived"
            active={activeItem === '/dashboard/archived'}
            to="/dashboard/archived"
            style={menuItemStyles}
            onClick={mobileCollapse}
          >
            <ArchiveStyledIcon icon="archive" className="archvieIconWithStyle" /> Archive
          </Menu.Item>

          <Menu.Item
            as={Link}
            name="settings"
            active={
              activeItem === '/settings' ||
              activeItem === '/customization/team' ||
              activeItem === '/customization' ||
              activeItem === '/profile' ||
              activeItem === '/billing'
            }
            to="/settings"
            style={menuItemStyles}
            onClick={mobileCollapse}
            onMouseEnter={() => setSvgHover('svgHover')}
            onMouseLeave={() => setSvgHover('')}
          >
            <span style={{ display: 'flex' }}>
              <StyledCog className={`cogIconStyle ${svgHover}`} />
              <span style={menuP}>Settings</span>
            </span>
          </Menu.Item>

          <div className={isMobile ? 'accordionDrop' : `noDropdown ${dropdown}`}>
            <Menu.Menu>
              {multiUser && isAdmin && !selectedPeerId && (
                <Menu.Item
                  as={Link}
                  name="customization/team"
                  active={activeItem === '/customization/team'}
                  to="/customization/team"
                  style={subMenuItemStyles}
                  onClick={mobileCollapse}
                >
                  <span>Team Customization</span>
                </Menu.Item>
              )}
              <Menu.Item
                as={Link}
                name="customization"
                active={activeItem === '/customization'}
                to="/customization"
                style={subMenuItemStyles}
                onClick={mobileCollapse}
              >
                <span>Personal Customization</span>
              </Menu.Item>

              <Menu.Item
                as={Link}
                name="profile"
                active={activeItem === '/profile'}
                to="/profile"
                style={subMenuItemStyles}
                onClick={mobileCollapse}
              >
                <span>Profile</span>
              </Menu.Item>

              {!selectedPeerId && (
                <Menu.Item
                  as={Link}
                  name="billing"
                  active={activeItem === '/billing'}
                  to="/billing"
                  style={subMenuItemBillingStyle}
                  onClick={() => {
                    if (moblileVisible) {
                      setMobileVisible(false);
                    }
                  }}
                >
                  <span>Billing</span>
                </Menu.Item>
              )}
            </Menu.Menu>
          </div>
        </NavigationLayout>
      </Dimmer.Dimmable>
    </SideNavToggle>
  );
};
