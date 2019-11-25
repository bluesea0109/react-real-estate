import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Dropdown, Header } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NavigationLayout, MobileDisabledLayout, MobileEnabledLayout } from '../layouts';
import { selectPeerId, deselectPeerId } from '../store/modules/peer/actions';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Image, Icon } from './Base';

const iconOnlyStyle = {
  margin: '0 auto 0 auto',
};

const iconWithTextStyle = {
  margin: '0 .5em 0 2.5em',
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
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [activeUser, setActiveUser] = useState('');

  const isMultimode = useSelector(store => store.onLogin.mode === 'multiuser');
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
      // console.log('profile: ', profile);

      return profiles.push({
        key: index,
        text: profile.last,
        value: profile.userId,
        content: (
          <StyledHeader as="h4">
            <Image size="mini" inline circular src="https://react.semantic-ui.com/images/avatar/large/patrick.png" />
            &nbsp;
            {profile.first}&nbsp;
            {profile.last}&nbsp;
            {profile.permissions && profile.permissions.teamAdmin ? '(Admin)' : '(Agent)'}&nbsp;
            <Icon name="check circle" />
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
    } else if (loggedInUser && activeUser === loggedInUser._id && selectedPeerId) {
      dispatch(deselectPeerId());
    }
  }, [loggedInUser, activeUser, selectedPeerId, dispatch]);

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
      {isMultimode && (
        <Menu.Item color="teal" name="customization" active={activeItem === '/customization'}>
          {renderCustomizationDropdown()}
        </Menu.Item>
      )}
      {!isMultimode && (
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
