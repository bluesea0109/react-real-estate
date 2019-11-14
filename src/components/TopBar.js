import React, { Fragment } from 'react';

import { Button, Container, Grid, Menu } from './Base';
import { signIn, signOut } from '../services/Auth0';

import LogoImage from './LogoImage';

export default ({ user }) => (
  <Menu fluid fixed="top">
    <Menu.Item as="a" header>
      <LogoImage />
    </Menu.Item>
    <Menu.Menu position="right">
      {!user && <Button onClick={signIn}>Login</Button>}
      {user && (
        <Fragment>
          <Button onClick={signOut}>Log Out</Button>
        </Fragment>
      )}
    </Menu.Menu>
  </Menu>
);
