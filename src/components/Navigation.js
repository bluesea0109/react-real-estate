import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NavigationLayout, MobileDisabledLayout, MobileEnabledLayout } from '../layouts';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from './Base';

const iconOnlyStyle = {
  margin: '0 auto 0 auto',
};

const iconWithTextStyle = {
  margin: '0 .5em 0 2.5em',
};

export default () => {
  const [activeItem, setActiveItem] = useState('');

  let location = useLocation();
  React.useEffect(() => {
    // TODO: Add google page tracking
    // ga.send(["pageview", location.pathname]);
    setActiveItem(location.pathname);
  }, [location]);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <NavigationLayout text>
      <Menu.Item as={Link} color="teal" name="dashboard" active={activeItem === '/dashboard'} onClick={handleItemClick} to="/dashboard">
        <MobileEnabledLayout style={iconOnlyStyle}>
          <FontAwesomeIcon icon="tachometer-alt" />
        </MobileEnabledLayout>
        <MobileDisabledLayout>
          <FontAwesomeIcon icon="tachometer-alt" style={iconWithTextStyle} /> Dashboard
        </MobileDisabledLayout>
      </Menu.Item>
      <Menu.Item as={Link} color="teal" name="customization" active={activeItem === '/customization'} onClick={handleItemClick} to="/customization">
        <MobileEnabledLayout style={iconOnlyStyle}>
          <FontAwesomeIcon icon="paint-brush" />
        </MobileEnabledLayout>
        <MobileDisabledLayout>
          <FontAwesomeIcon icon="paint-brush" style={iconWithTextStyle} /> Customization
        </MobileDisabledLayout>
      </Menu.Item>
      <Menu.Item as={Link} color="teal" name="profile" active={activeItem === '/profile'} onClick={handleItemClick} to="/profile">
        <MobileEnabledLayout style={iconOnlyStyle}>
          <FontAwesomeIcon icon="user" />
        </MobileEnabledLayout>
        <MobileDisabledLayout>
          <FontAwesomeIcon icon="user" style={iconWithTextStyle} /> Profile
        </MobileDisabledLayout>
      </Menu.Item>
      <Menu.Item as={Link} color="teal" name="settings" active={activeItem === '/settings'} onClick={handleItemClick} to="/settings">
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
