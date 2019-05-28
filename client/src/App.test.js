import React from 'react';
import { create } from "react-test-renderer";
import App from './App';
import { MockedProvider } from 'react-apollo/test-utils';

it('renders without crashing', () => {
  create(
    <MockedProvider mocks={[]}>
      <App />
    </MockedProvider>);
});
