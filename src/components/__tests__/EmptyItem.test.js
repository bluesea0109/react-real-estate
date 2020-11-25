import React from 'react';
import renderer from 'react-test-renderer';
import EmptyItem from '../EmptyItem';
import 'jest-styled-components';

it('renders correctly', () => {
  const tree = renderer.create(<EmptyItem />).toJSON();
  expect(tree).toMatchSnapshot();
});
