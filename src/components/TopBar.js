import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { signOut } from '../services/Auth0';
import { Button, Menu } from './Base';
import LogoImage from './LogoImage';

export default ({ user }) => (
  <Menu fluid fixed="top">
    <Menu.Item as="a" header>
      <LogoImage />
    </Menu.Item>
    <Menu.Menu position="right">
      {user && (
        <Fragment>
          <Button basic onClick={signOut}>
            Log Out <FontAwesomeIcon icon="sign-out-alt" style={{ marginLeft: '0.5em' }} />
          </Button>
        </Fragment>
      )}
    </Menu.Menu>
  </Menu>
);
