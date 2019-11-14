import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { signIn, signOut } from '../services/Auth0';
import { Button, Container, Menu } from './Base';
import styled from 'styled-components';

import LogoImage from './LogoImage';

const Profile = styled.span`
  margin-left: 15px;
`;

const ProfilePicture = styled.img`
  border-radius: 50%;
  max-width: 30px;
  margin-right: 5px;
`;

export default ({ user }) => (
  <Menu>
    <Container>
      <Menu.Item as="a" header>
        <LogoImage />
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item as={Link} name="login" to="/">
          To-Do List
        </Menu.Item>
        <Menu.Item as={Link} name="register" to="/new-item">
          + Add New
        </Menu.Item>
        <Menu.Item as={Link} name="custom" to="/custom-grid">
          Custom Grid
        </Menu.Item>
        {!user && <Button onClick={signIn}>Login</Button>}
        {user && (
          <Fragment>
            <Button onClick={signOut}>Logout</Button>
            <Profile>
              <ProfilePicture src={user.profile.picture} />
              {user.profile.email}
            </Profile>
          </Fragment>
        )}
      </Menu.Menu>
    </Container>
  </Menu>
);
