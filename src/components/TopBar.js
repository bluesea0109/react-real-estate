import React, { useState, useEffect, createRef, Fragment } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { selectPeerId, deselectPeerId } from '../store/modules/peer/actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Initials, Icon } from './Base';
import AuthService from '../services/auth';
import { Button, Menu } from './Base';
import LogoImage from './LogoImage';

import { Dropdown, Popup, Header } from 'semantic-ui-react';

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

export default ({ auth0 }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeUser, setActiveUser] = useState('');

  const loggedInUser = useSelector(store => store.onLogin.user);
  const selectedPeerId = useSelector(store => store.peer.peerId);
  const teammates = useSelector(store => store.team.profiles);

  const onLoginMode = useSelector(store => store.onLogin.mode);
  const multiUser = onLoginMode === 'multiuser';

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
  const profiles = [
    {
      key: 0,
      text: 'Logout',
      value: 0,
      content: (
        <Button basic onClick={AuthService.signOut} style={{ boxShadow: 'none' }}>
          Log Out <FontAwesomeIcon icon="sign-out-alt" style={{ marginLeft: '0.5em' }} />
        </Button>
      ),
    },
  ];

  if (teammates.length > 0) {
    teammates.map((profile, index) => {
      const setupComplete = profile.doc.setupComplete;
      const currentUser = profile.userId === loggedInUser._id;
      // const userEmail = profile.doc.email;

      const contextRef = createRef();
      const currentUserIconWithPopup = <Popup context={contextRef} content="Currently logged in user" trigger={<Icon name="user" />} />;
      const setupCompletedIconWithPopup = <Popup context={contextRef} content="Setup Completed" trigger={<Icon name="check circle" color="teal" />} />;

      return profiles.push({
        key: index + 1,
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

  return (
    <Menu fluid fixed="top" style={{ borderBottom: '1px solid rgba(34,36,38,.15)', boxShadow: 'none' }}>
      <Menu.Item as="a" header>
        <LogoImage />
      </Menu.Item>
      <Menu.Menu position="right">
        {auth0.authenticated && (
          <Fragment>
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
          </Fragment>
        )}
      </Menu.Menu>
    </Menu>
  );
};
