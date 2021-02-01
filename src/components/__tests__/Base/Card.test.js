import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Card } from '../../Base';
import { render, fireEvent, screen } from '@testing-library/react';

it('renders correctly', () => {
  const tree = renderer.create(<Card />);
  expect(tree).toMatchSnapshot();
});

it('Runs function on click', () => {
  const onClick = jest.fn();
  render(<Card data-testid="card" onClick={onClick} />);
  fireEvent.click(screen.getByTestId('card'));
  expect(onClick).toHaveBeenCalledTimes(1);
});
