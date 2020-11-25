import React from 'react';
import renderer from 'react-test-renderer';
import EmptyItem from '../EmptyItem';

it('renders correctly', () => {
  const tree = renderer.create(<EmptyItem />).toJSON();
  expect(tree).toMatchSnapshot();
});
