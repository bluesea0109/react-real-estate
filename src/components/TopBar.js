import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AuthService from '../services/auth';
import { Button, Menu } from './Base';
import LogoImage from './LogoImage';

export default ({ auth0 }) => (
  <Menu fluid fixed="top" style={{ 'border-bottom': '1px solid rgba(34,36,38,.15)', boxShadow: 'none' }}>
    <Menu.Item as="a" header>
      <LogoImage />
    </Menu.Item>
    <Menu.Menu position="right">
      {auth0.authenticated && (
        <Fragment>
          <Button basic onClick={AuthService.signOut} style={{ boxShadow: 'none' }}>
            Log Out <FontAwesomeIcon icon="sign-out-alt" style={{ marginLeft: '0.5em' }} />
          </Button>
        </Fragment>
      )}
    </Menu.Menu>
  </Menu>
);
