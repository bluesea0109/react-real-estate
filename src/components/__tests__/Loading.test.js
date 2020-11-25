import React from 'react';
import renderer from 'react-test-renderer';
import Loading from '../Loading';
import 'jest-styled-components';

it('renders correctly', () => {
  const tree = renderer.create(<Loading />).toJSON();
  expect(tree).toMatchSnapshot();
});
