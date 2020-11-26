import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Item } from '../../Base';
import { fireEvent, render, screen } from '@testing-library/react';

it('renders correctly', () => {
  const tree = renderer.create(<Item />);
  expect(tree).toMatchSnapshot();
});
