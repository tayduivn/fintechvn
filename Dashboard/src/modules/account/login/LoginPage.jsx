import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

import { withNotification, Loading } from 'components';
import { validateForm } from 'utils/validate';
import * as loginActions from 'modules/account/actions';
import * as sessionActions from 'modules/session/actions';

import img_panner from 'assets/plugins/images/admin-logo.png';

class LoginPage extends Component {
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
      
      if(email && password){
        email     = email.trim();
        password  = password.trim();

        if(email.length >= 7 && email.length <= 200 && password.length >= 6 && password.length <= 32){
          this.props.loginActions.login(email, password)
            .then(res => this.handleSuccess(res, remember))
            .catch(err => this.handleError(err));
        }
      }
    }
  }

  handleSuccess = (res, remember) => {
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

  render() {
    let { session } = this.props;
    
    if(this.state.isWorking === true) return (<Loading />);
    if (session && session.token != null) return (<Redirect to="/" />);

    return (
      <section id="wrapper" className="new-login-register">
        <div className="lg-info-panel">
          <div className="inner-panel">
            <Link to="/" className="p-20 di">
              <img alt={img_panner} src={img_panner} />
            </Link>
          </div>
        </div>
        <div className="new-login-box">
          <div className="white-box">
            <h3 className="box-title m-b-0">Sign In to Admin</h3>
            <small>Enter your details below</small>
            <form className="form-horizontal new-lg-form formSubmit" method="post" ref={e => this._formSubmit = e} onSubmit={ this.onSubmitFormLogin } name="myform" noValidate >
              <div className="form-group  m-t-20">
                <div className="col-xs-12">
                  <label>Email Address</label>
                  <input ref={e => this._emailInput = e} className="form-control" id="email" name="email" type="text" form-valid="email:7:100" placeholder="Email address" />
                  <span className="help-block">Email invalid or 7 - 100 characters</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-xs-12">
                  <label>Password</label>
                  <input ref={e => this._passwordInput = e} className="form-control" id="password" name="password" form-valid="str:6:32" type="password" placeholder="Password" />
                  <span className="help-block">Password 6 - 32 characters</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-12">
                  <div className="checkbox checkbox-info pull-left p-t-0">
                    <input ref={e => this._rememberInput = e} id="checkbox-signup" type="checkbox" />
                    <label htmlFor="checkbox-signup"> Remember me </label>
                  </div>
                  <Link to="/forgotpassword" id="to-recover" className="text-dark pull-right"><i className="fa fa-lock m-r-5"></i> Forgot pwd?</Link> 
                </div>
              </div>
              <div className="form-group text-center m-t-20">
                <div className="col-xs-12">
                  <button className="btn-outline btn btn-info fcbtn  btn-lg btbtn-1bn-block btn-rounded text-uppercase waves-effect waves-light" type="submit">Log In</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

let mapStateToProps = (state) => {
  let { session } = state;
  return { session };
};

let mapDispatchToProps = (dispatch) => {
  return {
    loginActions      : bindActionCreators(loginActions, dispatch),
    sessionActions    : bindActionCreators(sessionActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(LoginPage));