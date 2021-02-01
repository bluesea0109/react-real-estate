import React from 'react';
import renderer from 'react-test-renderer';
import SideNavToggle from '../SideNavToggle';
import 'jest-styled-components';

it('renders correctly', () => {
  const tree = renderer.create(<SideNavToggle />).toJSON();
  expect(tree).toMatchSnapshot();
});
