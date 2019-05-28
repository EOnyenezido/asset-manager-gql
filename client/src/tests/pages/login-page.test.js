import React from 'react';
import { create } from "react-test-renderer";
import { MockedProvider } from 'react-apollo/test-utils';
import Login from '../../pages/login';

// render
it('given no props, renders without crashing', () => {
  create(
    <MockedProvider mocks={[]}>
      <Login />
    </MockedProvider>);
});

// snapshot
describe('Snapshot testing', () => {
  it('matches the snapshot', () => {
    const page = create(
      <MockedProvider mocks={[]}>
      <Login />
    </MockedProvider>);
    expect(page.toJSON()).toMatchSnapshot();
  });
});

// form switching
describe('User is able to switch between forms', () => {
  it('Switches between forms on click', () => {
    const page = create(
      <MockedProvider mocks={[]}>
      <Login />
    </MockedProvider>);

    // check that it loads the sign in form on mount
    expect(page.toJSON().children[0].children[0].props.className).toEqual(expect.stringContaining('signin'));

    // check that it switches to signup when the request access link is clicked
    const requestAccessButton = page.root.findByProps({ id: "kt_login_signup" });
    requestAccessButton.props.onClick(); // click on the request access button to open the registration form    
    // the forms are switched using the 'hidden' property in a css class which is attached to the main container by react state
    expect(page.toJSON().children[0].children[0].props.className).toEqual(expect.stringContaining('signup'));

    // check that it switches back to sign in when the cancel button is clicked
    const cancelSignUpButton =  page.root.findByProps({ id: "kt_login_signup_cancel" });
    cancelSignUpButton.props.onClick();
    expect(page.toJSON().children[0].children[0].props.className).toEqual(expect.stringContaining('signin'));

    // check that it switches to forgot password form when 'forgot password' link is clicked
    const forgotPasswordLink = page.root.findByProps({ id: 'kt_login_forgot' });
    forgotPasswordLink.props.onClick();
    expect(page.toJSON().children[0].children[0].props.className).toEqual(expect.stringContaining('forgot'));

    // check that it switches back to sign in when the cancel button is clicked
    const cancelForgotButton =  page.root.findByProps({ id: "kt_login_forgot_cancel" });
    cancelForgotButton.props.onClick();
    expect(page.toJSON().children[0].children[0].props.className).toEqual(expect.stringContaining('signin'));
  });
});