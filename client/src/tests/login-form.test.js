import React from 'react';
import { create } from "react-test-renderer";
import LoginForm, { LOGIN_USER } from '../components/login-form';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

// render
it('given no props, renders without crashing', () => {
  create(
    <MockedProvider mocks={[]}>
      <LoginForm />
    </MockedProvider>);
});

// snapshot
describe('Snapshot testing', () => {
  it('matches the snapshot', () => {
    const component = create(
      <MockedProvider mocks={[]}>
      <LoginForm />
    </MockedProvider>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});

// login function
describe('Login function', () => {
  // success
  it('logs in a user with accurate details', async () => {
    const response = { emailAddress: 'foo@bar.com', firstName: 'Foo', lastName: 'Bar', id: 1, token: 'thisisasupersecurehash' }; // mock server says user is accurate
    const mocks = [
      {
        request: {
          query: LOGIN_USER,
          variables: { emailAddress: '', password: '' },
        },
        result: { data: { login: response } },
      },
    ];
    const component = create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoginForm />
      </MockedProvider>);
    const submitForm = component.root.findByType('form');
    submitForm.props.onSubmit();
    await wait(10); // wait for simulated delay for UI
    const alert = submitForm.findByProps({role: "alert"});
    
    // no errors or alerts
    expect(alert.props.hidden).toBeTruthy();
  });

  // error
  it('displays an error for a user with invalid details', async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_USER,
          variables: { emailAddress: '', password: '' },
        },
        result: { errors: [{ message: "Invalid username or password!" }] }, // server says user is invalid
      },
    ];
    const component = create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoginForm />
      </MockedProvider>);
    const submitForm = component.root.findByType('form');
    submitForm.props.onSubmit();
    await wait(10);
    const alert = submitForm.findByProps({role: "alert"});
    
    // alert message is shown and contains the message from the error thrown
    expect(alert.props.hidden).toBeFalsy();
    expect(alert.children[1].children).toContain('Invalid username or password!');
  });

  it('displays an error when connectivity cound not be established', async () => {
    const mocks = [
      {
        request: {
          query: LOGIN_USER,
          variables: { emailAddress: '', password: '' },
        },
        error: new Error('Uh oh, cannot seem to connect to server'), // no connection
      },
    ];
    const component = create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LoginForm />
      </MockedProvider>);
    const submitForm = component.root.findByType('form');
    submitForm.props.onSubmit();
    await wait(10);
    const alert = submitForm.findByProps({role: "alert"});
    
    // alert message is shown and contains the correct hardcoded message
    expect(alert.props.hidden).toBeFalsy();
    expect(alert.children[1].children).toContain('Unable to connect. Please check your connection and try again.');
  });
});