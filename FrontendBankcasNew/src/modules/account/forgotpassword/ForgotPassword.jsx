import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading } from 'components';
import { validateForm } from 'utils/validate';
import * as accountActions from 'modules/account/actions';

import img_panner from 'assets/plugins/images/admin-logo.png';

class ForgotPassword extends Component {

  _emailInput     = null;
  _formSubmit     = null;

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
        {id: 'email', rule: 'email:7:200'}
      ]
    );

    if(valid){
      let email     = this._emailInput.value;

      if(email){
        email     = email.trim();
       
        if(email.length >= 7  && email.length <= 200){
          this.setState({isWorking: true});

          this.props.accountActions.forgotPassword(email)
            .then(res => this.handleSuccess(res))
            .catch(err => this.handleError(err));

        }
      }
    }
  }

  handleSuccess = (res) => {
    let { notification, accountActions } = this.props;
    let { error, data }     = res;
    
    if(error){
      notification.e('Messages', error.messagse);
      this.setState({isWorking: false})
    }else if(data != null){
      let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/access-password/${data.mailToken}` ;
      let html = `You are forgot password.
            <a href='${url}'>Click here to forgot password</a>`;
      let dt = {
            to: data.email,
            subject: 'Forgot Password',
            html
          };
      
        accountActions.sendEmail(dt)
          .then(r =>  {
            if (!r) notification.e('Messages', 'Disconnect server');
            else{
              if(r.error)  notification.e('Messages', r.error.message);
              else if(r.data) notification.s('Messages', 'Forgot password success. Please check email !');
            }
            this.setState({isWorking: false})
          })
          .catch( () => {
            this.setState({isWorking: false});
          })
      
    }else{
      notification.e('Messages', 'Server disconnect');
      this.setState({isWorking: false})
    }
  }

  handleError = (err) => {
    let { notification } = this.props;
    this.setState({isWorking: false});
    notification.e('Message', err.messagse);
  }


  render() {
    let { isWorking } = this.state;

    if(isWorking) return <Loading />

    return (
      <section id="wrapper" className="new-login-register">
        <div className="lg-info-panel">
          <div className="inner-panel">
            <Link to="/" className="p-20 di"><img alt={img_panner} src={img_panner} /></Link>
          
          </div>
        </div>
        <div className="new-login-box">
          <div className="white-box">
            <h3 className="box-title m-b-0">Forgot Password</h3>
            <small>Enter your email</small>
            <form className="form-horizontal new-lg-form formSubmit" method="post" ref={e => this._formSubmit = e} onSubmit={ this.onSubmitFormLogin } name="myform" noValidate >
              <div className="form-group  m-t-20">
                <div className="col-xs-12">
                  <label>Email Address</label>
                  <input className="form-control" id="email" ref={e => this._emailInput = e} name="email" type="text" form-valid="email:7:200" placeholder="Email address" />
                  <span className="help-block">Email invalid or 7 - 200 characters</span>
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