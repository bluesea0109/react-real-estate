import React, { Fragment } from 'react';

import { Button, Container, Menu } from './Base';
import { signIn, signOut } from '../services/Auth0';

import LogoImage from './LogoImage';

export default ({ user }) => (
  <Menu>
    <Container>
      <Menu.Item as="a" header>
        <LogoImage />
      </Menu.Item>
      <Menu.Menu position="right">
        {!user && <Button onClick={signIn}>Login</Button>}
        {user && (
          <Fragment>
            <Button onClick={signOut}>Logout</Button>
          </Fragment>
        )}
      </Menu.Menu>
    </Container>
  </Menu>
);
