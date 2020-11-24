import React from 'react';
import ReactDOM from 'react-dom';
import { render } from './test-utils';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
