import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from '@testing-library/react';
import 'jest-styled-components';
import TopBar from '../FlipCard';

it('renders correctly', () => {
  const tree = renderer.create(
    <TopBar>
      <div></div>
    </TopBar>
  );
  expect(tree).toMatchSnapshot();
});

it('Does not render with 0 children', () => {
  let error;
  try {
    shallow(<TopBar />);
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(Error);
});
