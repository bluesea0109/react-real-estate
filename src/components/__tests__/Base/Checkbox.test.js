import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Checkbox } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Checkbox />);
  expect(tree).toMatchSnapshot();
});
