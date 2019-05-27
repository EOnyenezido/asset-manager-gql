// libraries
import React, { Component } from 'react';

// components
import LoginForm from '../components/login-form';
import SignUpForm from '../components/signup-form';
import ForgotPasswordForm from '../components/forgot-password-form';

// media
import logo from '../assets/media/logos/logo-main.png';
import backgroundImage from '../assets/media/backgrounds/bg-login.jpg';

// css
import '../assets/css/login.css';
import '../assets/css/style.bundle.css';
import WebFont from 'webfontloader';
import 'animate.css';


class Login extends Component {
  constructor(props)  {
    super(props);

    this.state = {
      formToDisplay: 'signin',
      signin: '',
      signup: '',
			forgot: ''
		}

		this.switchForm = this.switchForm.bind(this);
  }

	// Private functions
  switchForm(newForm, event) {
		if (event) {
			event.preventDefault(); // for request access link below. other events are managed within their components
		}
		this.setState({
      formToDisplay: newForm,
      [newForm]: 'animated flipInX'
    });
	}

	// Lifecycle methods
  componentDidMount() {
    WebFont.load({
      google: {"families":["Poppins:300,400,500,600,700","Roboto:300,400,500,600,700"]},
      active: function() {
          sessionStorage.fonts = true;
      }
    });
  }

  render() {
		console.log('parent login rendering');
		
		const { signin, signup, forgot } = this.state;
		return (
			<div className="div-body kt-header--fixed kt-header-mobile--fixed kt-subheader--fixed kt-subheader--enabled kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-page--loading">
				<div className="kt-grid kt-grid--ver kt-grid--root">
					<div className={`kt-grid kt-grid--hor kt-grid--root  kt-login kt-login--v3 kt-login--${this.state.formToDisplay}`} id="kt_login">
						<div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" style={{ backgroundImage: `url(${backgroundImage})` }}>
							<div className="kt-grid__item kt-grid__item--fluid kt-login__wrapper">
								<div className="kt-login__container">
									<div className="kt-login__logo">
										<a href="#/">
											<img alt="logo" src={logo} style={{ width: "20%" }} />
										</a>
									</div>
									<LoginForm signin={signin} switchForm={this.switchForm} />
									<SignUpForm signup={signup} switchForm={this.switchForm} />
									<ForgotPasswordForm forgot={forgot} switchForm={this.switchForm} />
									<div className="kt-login__account">
										<span className="kt-login__account-msg">
											Don't have an account ?
														</span>
										{'\u00A0'}{'\u00A0'}
										<a href="/" id="kt_login_signup" className="kt-login__account-link" onClick={this.switchForm.bind(this, 'signup')}>Request Access.</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
  }

}

export default Login;