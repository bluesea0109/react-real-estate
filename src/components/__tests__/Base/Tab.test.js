import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Tab } from '../../Base';

it('renders correctly', () => {
  const tree = renderer.create(<Tab />);
  expect(tree).toMatchSnapshot();
});
