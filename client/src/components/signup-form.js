// libraries
import React, { PureComponent } from 'react';

// css
import '../assets/css/login.css';
import '../assets/css/style.bundle.css';
import 'animate.css';


class SignUpForm extends PureComponent {
  constructor(props)  {
    super(props);

    this.state = {

		}

		this.switchForm = this.switchForm.bind(this);
  }

	// Private functions
  switchForm(event) {
		event.preventDefault();
		this.props.switchForm('signin'); // this state is lifted and managed by the parent login page
	}

  // Lifecycle methods
  render() {
		console.log('signup form rendering');
		
		return (
      <div className={`kt-login__signup ${this.props.signup}`}>
        <div className="kt-login__head">
          <h3 className="kt-login__title">Request Access</h3>
          <div className="kt-login__desc">Enter your details to request access:</div>
        </div>
        <form className="kt-form" action="">
          <div className="input-group row">
            <input className="form-control mr-2" type="text" placeholder="First Name" name="firstName" />
            <input className="form-control ml-2" type="text" placeholder="Last Name" name="lastName" />
          </div>
          <div className="input-group">
            <input className="form-control" type="text" placeholder="Email" name="emailAddress" autoComplete="off" />
          </div>
          <div className="input-group">
            <input className="form-control" type="text" placeholder="Phone Number" name="phoneNumber" />
          </div>
          <div className="input-group">
            <input className="form-control mr-2" type="password" placeholder="Password" name="password" />
            <input className="form-control ml-2" type="password" placeholder="Confirm Password" name="rpassword" />
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
            <button id="kt_login_signup_submit" className="btn btn-brand btn-elevate kt-login__btn-primary">Request</button>{'\u00A0'}{'\u00A0'}
            <button id="kt_login_signup_cancel" className="btn btn-light btn-elevate kt-login__btn-secondary" onClick={this.switchForm}>Cancel</button>
          </div>
        </form>
      </div>
		)
  }

}

export default SignUpForm;