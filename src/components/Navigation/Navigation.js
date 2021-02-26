import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Header, Popup } from 'semantic-ui-react';
import React, { createRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from 'react-redux';
import { resetMailout } from '../../store/modules/mailout/actions';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';

import { Dimmer, Initials, Icon } from '../Base';
import { useIsMobile } from '../Hooks/useIsMobile.js';

import { ReactComponent as Cog } from '../../assets/cog.svg';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import {
  MenuItem,
  NavigationLayout,
  OnboardSteps,
  OnboardStepsAdmin,
  SideNavToggle,
} from './index';

const menuP = {
  lineHeight: '2.6',
  fontSize: '40px !important',
  height: '56px',
  padding: '0.5em',
  marginLeft: '16px',
  marginTop: '-2px',
};

const StyledHeader = styled(Header)`
  min-width: max-content !important;
  display: inline-block;
`;

const StyledCog = styled(Cog)`
  width: 15px;
  height: 20px;
  margin-left: 14px;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin: 0em 1.4em 0em 0.65em;
`;

const FacebookStyledIcon = styled(FontAwesomeIcon)`
  margin: 0em 1.7em 0em 0.86em;
`;

const ImageStyledIcon = styled(FontAwesomeIcon)`
  margin: 0 1.4em 0 0.75em;
`;

export default function Navigation() {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [appIsBusy, setAppIsBusy] = useState(false);
  const [toggle, setToggle] = useState(null);
  const [moblileVisible, setMobileVisible] = useState(false);
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
    setActiveItem(location.pathname);
  }, [location]);

  if (teammates.length > 0) {
    teammates.map((profile, index) => {
      const setupComplete = profile.doc.setupComplete;
      const currentUser = profile.userId === loggedInUser._id;
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
          <OnboardStepsAdmin
            completedCustomization={completedCustomization}
            completedInviteTeammates={completedInviteTeammates}
            completedProfile={completedProfile}
            completedTeamCustomization={completedTeamCustomization}
            isMobile={isMobile}
            onCustomization={onCustomization}
            onInviteTeammates={onInviteTeammates}
            onProfile={onProfile}
            onTeamCustomization={onTeamCustomization}
          />
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
          <OnboardSteps
            completedCustomization={completedCustomization}
            completedProfile={completedProfile}
            isMobile={isMobile}
            onCustomizationSingleUser={onCustomizationSingleUser}
            onProfileSingleUser={onProfileSingleUser}
          />
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

        <NavigationLayout text>
          <MenuItem
            as={Link}
            name="dashboard"
            active={activeItem === '/dashboard'}
            to="/dashboard"
            onClick={mobileCollapse}
          >
            <StyledIcon icon="tachometer-alt" className="iconWithStyle" /> Dashboard
          </MenuItem>

          <MenuItem
            as={Link}
            name="listings"
            active={activeItem === '/listings'}
            to="/listings"
            onClick={mobileCollapse}
          >
            <StyledIcon icon="home" className="iconWithStyle" /> Listings
          </MenuItem>

          <MenuItem
            name="postcards"
            as={Link}
            to={'/postcards'}
            active={activeItem === '/postcards' || activeItem === '/create-postcard'}
            onClick={mobileCollapse}
          >
            <ImageStyledIcon icon={faImage} className="imageIconWithStyle" />
            <span>Postcards</span>
          </MenuItem>

          <MenuItem
            name="archive"
            as={Link}
            to={'/postcards/archived'}
            active={activeItem === '//postcards/archived'}
            onClick={mobileCollapse}
          >
            <ImageStyledIcon icon={faArchive} className="imageIconWithStyle" />
            <span>Archive</span>
          </MenuItem>

          {adProduct && multiUser && (
            <MenuItem
              as={Link}
              name="ads"
              active={activeItem === '/ads'}
              to="/ads"
              onClick={mobileCollapse}
            >
              <FacebookStyledIcon icon={faFacebookF} className="facebookIconWithStyle" /> Paid Ads
            </MenuItem>
          )}

          <MenuItem
            name="settings"
            as={Link}
            to={'/settings'}
            active={
              activeItem === '/settings' ||
              activeItem === '/customization/team' ||
              activeItem === '/customization' ||
              activeItem === '/profile' ||
              activeItem === '/billing'
            }
            onClick={mobileCollapse}
            onMouseEnter={() => setSvgHover('svgHover')}
            onMouseLeave={() => setSvgHover('')}
          >
            <StyledCog className={`cogIconStyle ${svgHover}`} />
            <span style={menuP}>Settings</span>
          </MenuItem>

          {(isMobile || toggle) && (
            <div className={'accordionDrop'}>
              <Link
                name="settings"
                className={activeItem === '/settings' ? 'active' : ''}
                to="/settings"
                onClick={mobileCollapse}
              >
                <span>General Settings</span>
              </Link>
              {multiUser && isAdmin && !selectedPeerId && (
                <Link
                  name="customization/team"
                  className={activeItem === '/customization/team' ? 'active' : ''}
                  to="/customization/team"
                  onClick={mobileCollapse}
                >
                  <span>Team Customization</span>
                </Link>
              )}
              <Link
                name="customization"
                className={activeItem === '/customization' ? 'active' : ''}
                to="/customization"
                onClick={mobileCollapse}
              >
                <span>Personal Customization</span>
              </Link>

              <Link
                name="profile"
                className={activeItem === '/profile' ? 'active' : ''}
                to="/profile"
                onClick={mobileCollapse}
              >
                <span>Profile</span>
              </Link>

              {!selectedPeerId && (
                <Link
                  name="billing"
                  className={activeItem === '/billing' ? 'active' : ''}
                  to="/billing"
                  onClick={() => {
                    if (moblileVisible) {
                      setMobileVisible(false);
                    }
                  }}
                >
                  <span>Billing</span>
                </Link>
              )}
            </div>
          )}
        </NavigationLayout>
      </Dimmer.Dimmable>
    </SideNavToggle>
  );
}
