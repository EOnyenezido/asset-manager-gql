// libraries
import React, { PureComponent } from 'react';

// css
import '../assets/css/login.css';
import '../assets/css/style.bundle.css';
import 'animate.css';


class ForgotPasswordForm extends PureComponent {
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
		console.log('forgot form rendering');
		
		return (
      <div className={`kt-login__forgot ${this.props.forgot}`}>
        <div className="kt-login__head">
          <h3 className="kt-login__title">Forgotten Password ?</h3>
          <div className="kt-login__desc">Enter your email to reset your password:</div>
        </div>
        <form className="kt-form" action="">
          <div className="input-group">
            <input className="form-control" type="text" placeholder="Email" name="email" id="kt_email" autoComplete="off" />
          </div>
          <div className="kt-login__actions">
            <button id="kt_login_forgot_submit" className="btn btn-brand btn-elevate kt-login__btn-primary">Request</button>{'\u00A0'}{'\u00A0'}
            <button id="kt_login_forgot_cancel" className="btn btn-light btn-elevate kt-login__btn-secondary" onClick={this.switchForm}>Cancel</button>
          </div>
        </form>
      </div>
		)
  }

}

export default ForgotPasswordForm;