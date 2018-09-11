import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { validateForm } from 'utils/validate';
import { withNotification, Loading } from 'components';
import * as loginActions from './actions';
import * as sessionActions from 'modules/session/actions';

class FormLogin extends Component {
  _emailInput     = null;
  _passwordInput  = null;
  _formSubmit     = null;
  _rememberInput  = null;

  constructor(props){
    super(props);
    this.state = {
      isWorking: false
    }
  }

  handleSuccess = (res, remember) => {// console.log(res);
    let { sessionActions, notification, history } = this.props;

    if( null != res.error){
      notification.e('Message', res.error.messagse);
      this.setState({isWorking: false});
    }else if(null != res.data){ 
      notification.s('Message', 'Login success');
      sessionActions.setSession(res.data, remember);
      history.push('/'); 
    }else{
      this.setState({isWorking: false});
      notification.e('Message', 'Login fail');
    }
  }

  handleError = (err) => {
    let { notification } = this.props;
    this.setState({isWorking: false});
    notification.e('Message', err.messagse);
  }

  onSubmitFormLogin = (e) => {
    e.preventDefault();

    let valid = validateForm(this._formSubmit,
      [
        {id: 'email', rule: 'email:7:200'},
        {id: 'password', rule: 'str:6:32'}
      ]
    );

    if(valid){
      let email     = this._emailInput.value;
      let password  = this._passwordInput.value;
      let remember = (this._rememberInput != null) ? this._rememberInput.checked : null;
      this.setState({isWorking: true});

      this.props.loginActions.login(email, password)
        .then(res => this.handleSuccess(res, remember))
        .catch(err => this.handleError(err));
    }
  }

  render() {
    if(this.state.isWorking === true) return (<Loading />);

    return (
      <form method="post" onSubmit={ this.onSubmitFormLogin } name="myform" noValidate >
        <div  ref={e => this._formSubmit = e}>
          <div className="form-field">
            <label htmlFor="email">Email Address</label>
            <input ref={e => this._emailInput = e}  className="form-control" type="email" id="email" name="email" />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input ref={e => this._passwordInput = e}  className="form-control" type="password" autoComplete="off"  id="password" name="password" />
          </div>
          <div className="col s12">
            <div className="checkbox auth_box">
              <input ref={e => this._rememberInput = e} type="checkbox" id="auth_register_terms" name="terms" autoComplete="off" required="required" />
              <label htmlFor="auth_register_terms">Remember password.</label>
            </div>
          </div>
          <input type="submit" value="Sign In" className="button" />
        </div>
      </form>
    );
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    loginActions      : bindActionCreators(loginActions, dispatch),
    sessionActions    : bindActionCreators(sessionActions, dispatch)
  };
};

export default withNotification(connect(null, mapDispatchToProps)(FormLogin));
