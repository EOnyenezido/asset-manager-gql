// libraries
import React, { PureComponent } from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

// css
import '../assets/css/login.css';
import '../assets/css/style.bundle.css';
import 'animate.css';

export const REGISTER_USER = gql`
  mutation register($emailAddress: String!, $password: String!, $firstName: String!, $lastName: String!, $phoneNumber: String!) {
    register(emailAddress: $emailAddress, password: $password, firstName: $firstName,
      lastName: $lastName, phoneNumber: $phoneNumber)	{
			id
			emailAddress
			firstName
			lastName
			token
		}
  }
`;


class SignUpForm extends PureComponent {
  constructor(props)  {
    super(props);

    this.state = {
      emailAddress: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
			error: false,
			errorMessage: '',
			disabled: false
		}

		this.handleChange = this.handleChange.bind(this);
    this.switchForm = this.switchForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Private functions
  
  handleChange(event)	{
		this.setState({
			[event.target.name]: event.target.value
		});	
	}

	handleSubmit(register, event)	{
		if (event) event.preventDefault();
		this.setState({error: false, disabled: true});
    register({ variables: {
      emailAddress: this.state.emailAddress,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber
    } });		
  }

  switchForm(event) {
		event.preventDefault();
		this.props.switchForm('signin'); // this state is lifted and managed by the parent login page
	}

  // Lifecycle methods
  render() {
		return (
      <ApolloConsumer>
				{client => (
					<Mutation
						mutation={REGISTER_USER}
						errorPolicy="all"
						onCompleted={({ register }) => { // data from server is returned in a 'register' prop
							// simulate two second delay for user experience
							setTimeout(() => {
								// can use setState here as it is a callback function
								if (register === null) { // some server issue caused registration to fail but server did not return an error
									this.setState({ error: true, disabled: false, errorMessage: 'An unknown error has occured, please contact administrator' });
								} else {
                  this.setState({ error: false, disabled: false });
									// Save token and user details to local storage
									localStorage.setItem('token', register.token);
									localStorage.setItem('user', JSON.stringify(register));
									client.writeData({ data: { isLoggedIn: true } });
								}
							}, 2000);							
						}}
						onError={({ graphQLErrors, networkError, operation, response }) => {
							if (networkError) {
								this.setState({ error: true, disabled: false, errorMessage: 'Unable to connect. Please check your connection and try again.' });
							} else if (graphQLErrors)  {
                this.setState({ error: true, disabled: false, errorMessage: graphQLErrors[0].message });
              } else { // unknown error
                this.setState({ error: true, disabled: false, errorMessage: 'An unknown error has occured, please contact administrator' });
              }
						}}
					>
						{(register) => { // register mutation passed here
            return (
              <div className={`kt-login__signup ${this.props.signup}`}>
                <div className="kt-login__head">
                  <h3 className="kt-login__title">Request Access</h3>
                  <div className="kt-login__desc">Enter your details to request access:</div>
                </div>
                <form className="kt-form" action="" onSubmit={this.handleSubmit.bind(this, register)} >
                  <div hidden={!this.state.error} className="kt-alert kt-alert--outline alert alert-danger alert-dismissible animated fadeIn" role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
                    <span>{this.state.errorMessage}</span>
                  </div>
                  <div className="input-group row">
                    <input className="form-control mr-2" type="text" placeholder="First Name" name="firstName" onChange={this.handleChange} />
                    <input className="form-control ml-2" type="text" placeholder="Last Name" name="lastName" onChange={this.handleChange} />
                  </div>
                  <div className="input-group">
                    <input className="form-control" type="text" placeholder="Email" name="emailAddress" autoComplete="off" onChange={this.handleChange} />
                  </div>
                  <div className="input-group">
                    <input className="form-control" type="text" placeholder="Phone Number" name="phoneNumber" onChange={this.handleChange} />
                  </div>
                  <div className="input-group">
                    <input className="form-control mr-2" type="password" placeholder="Password" name="password" onChange={this.handleChange} />
                    <input className="form-control ml-2" type="password" placeholder="Confirm Password" name="rpassword" onChange={this.handleChange} />
                  </div>
                  <div className="row kt-login__extra">
                    <div className="col kt-align-left">
                      <label className="kt-checkbox">
                        <input type="checkbox" name="agree" />I Agree the <a href="/" className="kt-link kt-login__link kt-font-bold">terms and conditions</a>.
																		<span></span>
                      </label>
                      <span className="form-text text-muted"></span>
                    </div>
                  </div>
                  <div className="kt-login__actions">
                    <button id="kt_login_signup_submit" className={`btn btn-brand btn-elevate kt-login__btn-primary ${this.state.disabled ? "kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light" : ""}`} disabled={this.state.disabled}>{this.state.disabled ? "Requesting... " : "Request"}</button>{'\u00A0'}{'\u00A0'}
                    <button id="kt_login_signup_cancel" className="btn btn-light btn-elevate kt-login__btn-secondary" onClick={this.switchForm}>Cancel</button>
                  </div>
                </form>
              </div>
						);
          }}
					</Mutation>
				)}
			</ApolloConsumer>
		)
  }

}

export default SignUpForm;