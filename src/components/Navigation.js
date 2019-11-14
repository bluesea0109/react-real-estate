import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu } from './Base';

import LogoImage from './LogoImage';

export default () => (
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
      </Menu.Menu>
    </Container>
  </Menu>
);
