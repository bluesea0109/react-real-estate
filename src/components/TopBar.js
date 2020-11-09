import React, { useState, useEffect, createRef, Fragment } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { selectPeerId, deselectPeerId } from '../store/modules/peer/actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Initials, Icon, Button, Menu, Header } from './Base';
import AuthService from '../services/auth';
import LogoImage from './LogoImage';

import { Dropdown, Popup } from 'semantic-ui-react';
import { useIsMobile } from './Hooks/useIsMobile';
import * as brandColors from './utils/brandColors';

const StyledUserSelectorDropdown = styled(Dropdown)`
  &&&&& {
    height: 40px;
    border-radius: 20px;
    border-color: #e6e6e6;
    max-width: 400px;
    min-width: 100px;
    padding: 0.2em 2.1em 0.78571429em 0.2em;
    border-bottom-left-radius: 20px !important;
    border-bottom-right-radius: 20px !important;
    box-shadow: none;
    & img {
      object-fit: cover;
      margin-top: 0px;
      margin-bottom: 0px;
      margin-right: 0px;
      max-height: none;
      width: 32px;
      height: 32px;
    }
    .menu.visible {
      margin-top: 1.15em !important;
      overflow-y: scroll;
      max-height: calc(90vh - 40px);
      min-width: max-content !important;
      border: none;
      -ms-overflow-style: none; /* Internet Explorer 10+ */
      scrollbar-width: none; /* Firefox */
      ::-webkit-scrollbar {
        display: none;
      }
      h4,
      p {
        font-size: 14px !important;
      }
      .button:hover {
        p {
          color: #59c4c4 !important;
        }
      }
    }
    .menu > .item {
      padding: 9px 12px 9px !important;
      display: flex;
      & h4 {
        font-weight: normal !important;
      }
      &:hover {
        background-color: ${brandColors.lightGreyHover} !important;
      }
      &.active {
        background-color: transparent !important;
        color: ${brandColors.primary} !important;
        font-weight: bold !important;
        & h4 {
          font-weight: bold !important;
        }
      }
      & button {
        background-color: transparent !important;
      }
    }
  }
`;

const StyledHeader = styled(Header)`
  min-width: max-content !important;
  display: inline-block;
  margin-top: 0px;
`;

const logoutIcon = {
  marginLeft: '1px',
  width: '32px',
  background: '#E6E6E6',
  height: '32px',
  padding: ' 8px',
  borderRadius: '40px',
};

const LogoutButton = styled(Button)`
  &&&,
  &&&:hover {
    padding: 6px 0 5px 0 !important;
    box-shadow: none;
    width: 100%;
  }
  &&&:hover {
    color: ${brandColors.primary} !important;
  }
`;

const logoutText = {
  marginTop: '7px',
  marginLeft: '12px',
  fontWeight: '600',
  fontSize: '16px',
  color: '#3B3B3B',
};

const dropdownPicStyle = {
  width: '32px',
  height: '32px',
  display: 'block',
  overflow: 'hidden',
  borderRadius: '50%',
};

export default ({ auth0 }) => {
  const isMobile = useIsMobile();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeUser, setActiveUser] = useState('');

  const loggedInUser = useSelector(store => store.onLogin.user);
  let loggedInAdmin = null;
  const selectedPeerId = useSelector(store => store.peer.peerId);
  const teammates = useSelector(store => store.team.profiles);

  if (loggedInUser && teammates.length) {
    loggedInAdmin = teammates.find(user => user.userId === loggedInUser._id).permissions.teamAdmin;
  }

  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';
  const completedInviteTeammates = useSelector(store => store.onboarded.completedInviteTeammates);

  const menuSpacing = () => (isMobile ? {} : { marginLeft: '.5em', padding: '0px 14px' });

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

  const handleProfileSelect = (e, { value }) => setActiveUser(value);
  const renderLabel = label => ({
    color: 'blue',
    content: `${label.text2}`,
  });
  let profiles = [
    {
      key: 0,
      text: 'Logout',
      value: 0,
      content: (
        <LogoutButton basic onClick={AuthService.signOut}>
          <div style={{ display: 'flex' }}>
            <FontAwesomeIcon icon="sign-out-alt" style={logoutIcon} />
            <p style={logoutText}>Log Out</p>
          </div>
        </LogoutButton>
      ),
    },
  ];

  if (teammates && teammates.length > 0) {
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
      const realtorPhoto = profile.realtorPhoto;
      let imageProp =
        realtorPhoto && realtorPhoto.length ? { avatar: true, src: realtorPhoto } : null;

      const currentProfile = {
        key: profile.doc._id,
        text: (
          <div style={{ display: 'flex' }}>
            {realtorPhoto && realtorPhoto.length ? (
              <>
                <div style={dropdownPicStyle}>
                  <img src={realtorPhoto} alt="Brivity Marketer" />
                </div>
                <p style={{ marginTop: '6px', marginLeft: '11px' }}> {profile.first}</p>
              </>
            ) : (
              <>
                <Initials firstName={profile.first} lastName={profile.last} />
                <p style={{ marginTop: '6px', marginLeft: '11px' }}>{profile.first}</p>
              </>
            )}
          </div>
        ),
        value: profile.userId,
        image: imageProp,
        first: profile.first,
        content: (
          <StyledHeader as="h4" ref={contextRef}>
            {imageProp === null ? (
              <Initials firstName={profile.first} lastName={profile.last} />
            ) : null}
            &nbsp; &nbsp;
            {profile.first}&nbsp;
            {profile.last}&nbsp;
            {profile.permissions && profile.permissions.teamAdmin ? '(Admin)' : '(Agent)'}&nbsp;
            <span>{currentUser ? currentUserIconWithPopup : null}</span>
            <span>{setupComplete ? setupCompletedIconWithPopup : null}</span>
          </StyledHeader>
        ),
      };

      if (loggedInAdmin) {
        if (currentUser) return profiles.splice(1, 0, { ...currentProfile });
        else return profiles.push({ ...currentProfile });
      } else {
        if (loggedInUser._id === profile.userId) return profiles.push({ ...currentProfile });
      }
    });
    // sort profiles A-Z (not including logout or admin)
    let notSorted = profiles.splice(0, 2);
    profiles.sort((a, b) => a.first.localeCompare(b.first));
    profiles = [...notSorted, ...profiles];
  }

  return (
    <Menu fluid fixed="top" style={{ borderBottom: '2px solid #E6E6E6', boxShadow: 'none' }}>
      <Menu.Item as="a" href="/" header>
        <LogoImage />
      </Menu.Item>
      <Menu.Menu position="right">
        {auth0.authenticated && (
          <Fragment>
            {multiUser && completedInviteTeammates && (
              <Menu.Item style={menuSpacing()}>
                <StyledUserSelectorDropdown
                  className="activeDropdown"
                  floating
                  selection
                  options={profiles}
                  onChange={handleProfileSelect}
                  value={activeUser}
                  renderLabel={renderLabel}
                />
              </Menu.Item>
            )}
          </Fragment>
        )}
      </Menu.Menu>
    </Menu>
  );
};
