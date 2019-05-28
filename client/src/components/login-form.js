// libraries
import React, { PureComponent } from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

// css
import '../assets/css/login.css';
import '../assets/css/style.bundle.css';
import 'animate.css';

export const LOGIN_USER = gql`
  mutation login($emailAddress: String!, $password: String!) {
    login(emailAddress: $emailAddress, password: $password)	{
			id
			emailAddress
			firstName
			lastName
			token
		}
  }
`;

class LoginForm extends PureComponent {
  constructor(props)  {
    super(props);

    this.state = {
			emailAddress: '',
			password: '',
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

	handleSubmit(login, event)	{
		if (event) event.preventDefault();
		this.setState({error: false, disabled: true});
		login({ variables: {emailAddress: this.state.emailAddress, password: this.state.password} });		
  }

  switchForm(event) {
		event.preventDefault();
		this.props.switchForm('forgot'); // this state is lifted and managed by the parent login page
	}
  
  // Lifecycle methods
  render() {
		return (
			<ApolloConsumer>
				{client => (
					<Mutation
						mutation={LOGIN_USER}
						errorPolicy="all"
						onCompleted={({ login }) => {
							// simulate two second delay for user experience
							setTimeout(() => {
								// can use setState here as it is a callback function
								if (login === null) { // username or password is incorrect
									this.setState({ error: true, disabled: false, errorMessage: 'Incorrect username or password. Please try again.' });
								} else {
									this.setState({ error: false, disabled: false });
									// Save token and user details to local storage
									localStorage.setItem('token', login.token);
									localStorage.setItem('user', JSON.stringify(login));
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
						{(login) => {
            return (
              <div className={`kt-login__signin ${this.props.signin}`}>
                <div className="kt-login__head">
                  <h3 className="kt-login__title">Sign In To Asset Manager</h3>
                </div>
                <form className="kt-form" action="" onSubmit={this.handleSubmit.bind(this, login)} >
                  <div hidden={!this.state.error} className="kt-alert kt-alert--outline alert alert-danger alert-dismissible animated fadeIn" role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
                    <span>{this.state.errorMessage}</span>
                  </div>
                  <div className="input-group">
                    <input className="form-control" type="text" placeholder="Email" name="emailAddress" autoComplete="off" onChange={this.handleChange} />
                  </div>
                  <div className="input-group">
                    <input className="form-control" type="password" placeholder="Password" name="password" onChange={this.handleChange} />
                  </div>
                  <div className="row kt-login__extra">
                    <div className="col">
                      <label className="kt-checkbox">
                        <input type="checkbox" name="remember" /> Remember me
																		<span></span>
                      </label>
                    </div>
                    <div className="col kt-align-right">
                      <a href="/" id="kt_login_forgot" className="kt-login__link" onClick={this.switchForm}>Forgot Password ?</a>
                    </div>
                  </div>
                  <div className="kt-login__actions">
                    <button id="kt_login_signin_submit" className={`btn btn-brand btn-elevate kt-login__btn-primary ${this.state.disabled ? "kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light" : ""}`} disabled={this.state.disabled}>{this.state.disabled ? "Signing In... " : "Log In"}</button>
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

export default LoginForm;