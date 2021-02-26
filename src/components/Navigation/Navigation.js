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

import { StepLayout, StepsLayout, NavigationLayout } from '../../layouts';
import { Dimmer, Menu, Initials, Icon, Step } from '../Base';
import { useIsMobile } from '../Hooks/useIsMobile.js';

import SideNavToggle from '../SideNavToggle';
import { ReactComponent as Cog } from '../../assets/cog.svg';
import { ReactComponent as Icon1 } from '../../assets/1-icon.svg';
import { ReactComponent as Icon2 } from '../../assets/2-icon.svg';
import { ReactComponent as Icon3 } from '../../assets/3-icon.svg';
import { ReactComponent as Icon4 } from '../../assets/4-icon.svg';
import * as brandColors from '../utils/brandColors';
import { faArchive } from '@fortawesome/free-solid-svg-icons';

const sidebarTextStyle = {
  fontSize: '16px',
  width: '100%',
  marginLeft: '16px',
  marginTop: '-3px',
};

const menuP = {
  lineHeight: '2.6',
  fontSize: '40px !important',
  height: '56px',
  padding: '0.5em',
  marginLeft: '16px',
  marginTop: '-2px',
};

const StyledMenuItem = styled(Menu.Item)`
  &&&&&& {
    line-height: 2.6;
    font-size: 16px;
    height: 56px;
    padding: 0.5rem;
    border-bottom: 1px solid #eaedf0;
    color: ${brandColors.grey03};
    &.active {
      color: ${brandColors.primary};
      border-left: 5px solid ${brandColors.primary};
      border-bottom: none !important;
      font-weight: 600;
      background-color: ${brandColors.primaryLight} !important;
      .iconWithStyle {
        margin: 0 1.5rem 0 0.35rem;
        width: 1.25rem;
      }
      .imageIconWithStyle {
        margin: 0 1.3rem 0 0.55rem;
        width: 1.25rem;
      }
      .facebookIconWithStyle {
        margin-left: 0.57em;
      }
      .cogIconStyle {
        margin-left: 8px;
      }
      svg {
        path {
          fill: ${brandColors.primary};
        }
      }
    }
    svg {
      font-size: 17px;
    }
  }
`;

const MenuItem = ({ active, ...props }) => (
  <StyledMenuItem {...props} className={active ? 'active' : undefined} />
);

const SubMenuContainer = styled.div`
  border-bottom: 1px solid #eaedf0;
  display: flex;
  flex-direction: column;
`;

const StyledSubMenuItem = styled(Menu.Item)`
  &&&&&& {
    line-height: 2;
    font-size: 14px;
    height: 40px;
    padding: 0.5rem;
    color: ${brandColors.grey03};
    &.active {
      color: ${brandColors.primary};
      font-weight: 600;
    }
  }
`;

const SubMenuItem = ({ active, ...props }) => (
  <StyledSubMenuItem {...props} className={active ? 'active' : undefined} />
);

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
  margin: 0em 1em 0em 0.65em;
`;

const FacebookStyledIcon = styled(FontAwesomeIcon)`
  margin: 0em 1.3em 0em 0.86em;
`;

const ImageStyledIcon = styled(FontAwesomeIcon)`
  margin: 0 1.3rem 0 0.85rem;
`;

export default function Navigation() {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [appIsBusy, setAppIsBusy] = useState(false);
  const [postcardDropdown, setPostcardDropdown] = useState(false);
  const [settingsDropdown, setSettingsDropdown] = useState(false);
  const [toggle, setToggle] = useState(null);
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
    if (!toggle) {
      setPostcardDropdown(false);
      setSettingsDropdown(false);
    }

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
          vertical={!isMobile}
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

          {isMobile && (
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
          )}

          {!isMobile && (
            <>
              <MenuItem
                name="postcards"
                active={
                  activeItem === '/postcards' ||
                  activeItem === '/create-postcard' ||
                  activeItem === '/postcards/archived' ||
                  activeItem === '/dashboard/archived'
                }
                onClick={() =>
                  postcardDropdown ? setPostcardDropdown(false) : setPostcardDropdown(true)
                }
              >
                <ImageStyledIcon icon={faImage} className="imageIconWithStyle" />
                <span>Postcards</span>
                <Icon name={postcardDropdown === 'postcards' ? 'angle up' : 'angle down'} />
              </MenuItem>
              {postcardDropdown && (
                <SubMenuContainer>
                  <SubMenuItem
                    name="all-campaigns"
                    as={Link}
                    to="/postcards"
                    active={activeItem === '/postcards'}
                  >
                    <ImageStyledIcon icon={faImage} className="imageIconWithStyle" />
                    <span>All Campaigns</span>
                  </SubMenuItem>
                  <SubMenuItem
                    name="archived-campaigns"
                    as={Link}
                    to="/postcards/archived"
                    active={activeItem === '/postcards/archived'}
                  >
                    <ImageStyledIcon icon={faArchive} className="imageIconWithStyle" />
                    <span>Archived Campaigns</span>
                  </SubMenuItem>
                </SubMenuContainer>
              )}
              {/* <div className={`${postcardDropdown ? 'accordionDrop' : 'noDropdown'}`}>
                {activeItem !== '/postcards' && (
                  <Link name="archived-campaigns" to="/postcards" onClick={() => setToggle(false)}>
                    <span>View All Campaigns</span>
                  </Link>
                )}
                {activeItem !== '/postcards/archived' && activeItem !== '/dashboard/archived' && (
                  <Link
                    name="view-campaigns"
                    to="/postcards/archived"
                    onClick={() => setToggle(false)}
                  >
                    <span>Archived Campaigns</span>
                  </Link>
                )}
                {activeItem !== '/create-postcard' && (
                  <>
                    <Link
                      name="create-postcard-listed"
                      to={{
                        pathname: '/create-postcard',
                        state: { filter: 'listed' },
                      }}
                      onClick={() => setToggle(false)}
                    >
                      <span>New Listed Campaign</span>
                    </Link>
                    <Link
                      name="create-postcard-sold"
                      to={{
                        pathname: '/create-postcard',
                        state: { filter: 'sold' },
                      }}
                      onClick={() => setToggle(false)}
                    >
                      <span>New Sold Campaign</span>
                    </Link>
                    <Link
                      name="create-postcard-handwritten"
                      to={{
                        pathname: '/create-postcard',
                        state: { filter: 'handwritten' },
                      }}
                      onClick={() => setToggle(false)}
                    >
                      <span>New Handwritten Campaign</span>
                    </Link>
                    <Link
                      name="create-postcard-holiday"
                      to={{
                        pathname: '/create-postcard',
                        state: { filter: 'holiday' },
                      }}
                      onClick={() => setToggle(false)}
                    >
                      <span>New Holiday Campaign</span>
                    </Link>
                    <Link
                      name="create-postcard-custom"
                      to={{
                        pathname: '/create-postcard',
                        state: { filter: 'custom' },
                      }}
                      onClick={() => setToggle(false)}
                    >
                      <span>New Custom Campaign</span>
                    </Link>
                  </>
                )}
              </div> */}
            </>
          )}
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
            active={
              activeItem === '/settings' ||
              activeItem === '/customization/team' ||
              activeItem === '/customization' ||
              activeItem === '/profile' ||
              activeItem === '/billing'
            }
            onClick={() =>
              isMobile
                ? mobileCollapse()
                : settingsDropdown
                ? setSettingsDropdown(false)
                : setSettingsDropdown(true)
            }
            onMouseEnter={() => setSvgHover('svgHover')}
            onMouseLeave={() => setSvgHover('')}
          >
            <StyledCog className={`cogIconStyle ${svgHover}`} />
            <span style={menuP}>Settings</span>
            {!isMobile && <Icon name={settingsDropdown ? 'angle up' : 'angle down'} />}
          </MenuItem>

          {(isMobile || settingsDropdown) && (
            <div
              className={
                isMobile ? 'accordionDrop' : `${settingsDropdown ? 'accordionDrop' : 'noDropdown'}`
              }
            >
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
