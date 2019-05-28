import React from 'react';
import { create } from "react-test-renderer";
import SignUpForm, { REGISTER_USER } from '../../components/signup-form';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

// render
it('given no props, renders without crashing', () => {
  create(
    <MockedProvider mocks={[]}>
      <SignUpForm />
    </MockedProvider>);
});

// snapshot
describe('Snapshot testing', () => {
  it('matches the snapshot', () => {
    const component = create(
      <MockedProvider mocks={[]}>
      <SignUpForm />
    </MockedProvider>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});

// registration function
describe('Registration function', () => {
  // success
  it('registers a user with accurate details', async () => {
    const response = { emailAddress: 'foo@bar.com', firstName: 'Foo', lastName: 'Bar', id: 1, token: 'thisisasupersecurehash' };
    const mocks = [
      {
        request: {
          query: REGISTER_USER,
          variables: {
            emailAddress: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: ''
          },
        },
        result: { data: { register: response } },
      },
    ];
    const component = create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SignUpForm />
      </MockedProvider>);
    const submitForm = component.root.findByType('form');
    submitForm.props.onSubmit();
    await wait(10); // wait for simulated delay for UI
    const alert = submitForm.findByProps({role: "alert"});
    
    // no errors or alerts
    expect(alert.props.hidden).toBeTruthy();
  });

  // error
  it('displays an error for a registration with invalid details', async () => {
    const mocks = [
      {
        request: {
          query: REGISTER_USER,
          variables: {
            emailAddress: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: ''
          },
        },
        result: { errors: [{ message: 'Field "password" must contain at least 10 characters!' }] }, // server says registration is invalid
      },
    ];
    const component = create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SignUpForm />
      </MockedProvider>);
    const submitForm = component.root.findByType('form');
    submitForm.props.onSubmit();
    await wait(10);
    const alert = submitForm.findByProps({role: "alert"});
    
    // alert message is shown and contains the message from the error thrown
    expect(alert.props.hidden).toBeFalsy();
    expect(alert.children[1].children).toContain('Field "password" must contain at least 10 characters!');
  });

  it('displays an error when connectivity cound not be established', async () => {
    const mocks = [
      {
        request: {
          query: REGISTER_USER,
          variables: {
            emailAddress: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: ''
          },
        },
        error: new Error('Uh oh, cannot seem to connect to server'), // no connection
      },
    ];
    const component = create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SignUpForm />
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