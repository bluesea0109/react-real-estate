import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from '@testing-library/react';
import 'jest-styled-components';
import FlipCard from '../FlipCard';

it('renders correctly', () => {
  const tree = renderer.create(
    <FlipCard>
      <div></div>
      <div></div>
    </FlipCard>
  );
  expect(tree).toMatchSnapshot();
});

it('Does not render with 0 children', () => {
  let error;
  try {
    shallow(<FlipCard />);
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(Error);
});

it('Does not render with 1 child', () => {
  let error;
  try {
    shallow(
      <FlipCard>
        <div></div>
      </FlipCard>
    );
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(Error);
});
