import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading, Error404 } from 'components';
import { validateForm } from 'utils/validate';
import * as accountActions from 'modules/account/actions';
import img_panner from 'assets/plugins/images/admin-logo.png';

class ForgotPassword extends Component {

  _repasswordInput      = null;
  _passwordInput        = null;
  _formSubmit           = null;

  constructor(props){
    super(props);
    this.state = {
      isWorking: false,
      data       : null
    }
  }

  componentWillMount(){
    let { match } = this.props;
    let { token } = match.params;
    if (token && token.length === 86) {
      this.props.accountActions.checkToken(token)
        .then(r => {
          if(r && r.data){
            let { data } = r;
            this.setState({data});
          }
        })
    }
  }

  onSubmitFormLogin = (e) => {
    e.preventDefault();

    let valid = validateForm(this._formSubmit, [
      {id: 'password', rule: 'str:6:32'},
      {id: 'repassword', rule: 'str:6:32'}
    ]);

    if(valid){
      let { notification } = this.props;
      let { data }      = this.state;
      let password     = this._passwordInput.value;
      let repassword   = this._repasswordInput.value;

      password    = password.trim();
      repassword  = repassword.trim();

      if(password === repassword){
        this.setState({isWorking: true});

        this.props.accountActions.accessForgotPassword({...data, password})
          .then(r => {
            if(r.error) return Promise.reject(r.error);
            if(r.data) {
              notification.s('Messages', 'Change password success');
              this.setState({isWorking: false});
              this.props.history.push('/');
            }
          })
          .catch(e => notification.e('Messages', e.message));

      }else{
        notification.e('Messages', 'Password no match');
      }
    }

  }

  render() {
    let { data, isWorking } = this.state;

    if (data == null) return <Error404 />;
    if(isWorking === true) return (<Loading />);

    return (
      <section id="wrapper" className="new-login-register">
        <div className="lg-info-panel">
          <div className="inner-panel">
            <Link to="/" className="p-20 di"><img alt={img_panner} src={img_panner} /></Link>
          
          </div>
        </div>
        <div className="new-login-box">
          <div className="white-box">
            <h3 className="box-title m-b-0">Access Password</h3>
            <small>Enter your password new</small>
            <form className="form-horizontal new-lg-form formSubmit" method="post" ref={e => this._formSubmit = e} onSubmit={ this.onSubmitFormLogin } name="myform" noValidate >
              <div className="form-group">
                <div className="col-xs-12">
                  <label>Password</label>
                  <input ref={e => this._passwordInput = e} className="form-control" id="password" name="password" form-valid="str:6:32" type="password" placeholder="Password" />
                  <span className="help-block">Password 6 - 32 characters</span>
                </div>
              </div>

              <div className="form-group">
                <div className="col-xs-12">
                  <label>RePassword</label>
                  <input ref={e => this._repasswordInput = e} className="form-control" id="repassword" name="password" form-valid="str:6:32" type="password" placeholder="RePassword" />
                  <span className="help-block">Password 6 - 32 characters</span>
                </div>
              </div>

              <div className="form-group text-center m-t-20">
                <div className="col-xs-12">
                  <button className="btn-outline btn btn-info fcbtn btn-1b btn-lg btn-block btn-rounded text-uppercase waves-effect waves-light" type="submit">Submit</button>
                </div>
              </div>
              <div className="form-group m-b-0">
                  <div className="col-sm-12 text-center">
                    <p>Already have an account? <Link to="/login" className="text-primary m-l-5"><b>Sign In</b></Link></p>
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
  return {  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    accountActions      : bindActionCreators(accountActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ForgotPassword));