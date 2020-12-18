import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Initials } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Initials />);
  expect(tree).toMatchSnapshot();
});
