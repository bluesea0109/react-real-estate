import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { Dimmer } from '../../Base';
import { fireEvent, render, screen } from '@testing-library/react';

it('renders correctly', () => {
  const tree = renderer.create(<Dimmer />);
  expect(tree).toMatchSnapshot();
});

it('Runs function on click', () => {
  const onClick = jest.fn();
  render(<Dimmer data-testid="dimmer" onClick={onClick} />);
  fireEvent.click(screen.getByTestId('dimmer'));
  expect(onClick).toHaveBeenCalledTimes(1);
});
