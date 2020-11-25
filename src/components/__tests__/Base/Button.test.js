import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render, screen } from '@testing-library/react';
import 'jest-styled-components';
import { Button } from '../../Base';

test('renders-correctly', () => {
  const tree = renderer.create(<Button />);
  expect(tree).toMatchSnapshot();
});

it('Runs function on click', () => {
  const onClick = jest.fn();
  render(<Button onClick={onClick}>Click</Button>);
  fireEvent.click(screen.getByText('Click'));
  expect(onClick).toHaveBeenCalledTimes(1);
});
