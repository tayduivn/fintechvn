import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { validateForm } from 'utils/validate';
import { withNotification, Loading } from 'components';
import * as loginActions from './../actions';

class ForgotPassword extends Component {
  _emailInput     = null;
  _formSubmit     = null;

  constructor(props){
    super(props);
    this.state = {
      isWorking: false
    }
  }

  handleSuccess = (res) => {
    let { notification } = this.props;
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
      
        loginActions.sendEmail(dt)
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
    notification.e('Message', err.messagse);
    this.setState({isWorking: false})
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

          loginActions.forgotPassword(email)
            .then(res => this.handleSuccess(res))
            .catch(err => this.handleError(err));

        }
      }
    }
  }

  render() {

    let { isWorking } = this.state;

    if(isWorking) return <Loading />

    return (
      <div className="center-container">
        <div className="header-w3l" style={{paddingTop: '10em'}}>
          <h1>Financial Technology</h1>
        </div>
        <div className="main-content-agile">
          <div className="sub-main-w3">	
            <div className="wthree-pro">
              <h2>forgot password channel</h2>
            </div>
            <form onSubmit={ this.onSubmitFormLogin } ref={e => this._formSubmit = e}>
              <div className="pom-agile">
                <input ref={e => this._emailInput = e} type="email" id="email" placeholder="E-mail" name="email" className="user form-control" required="" />
                <span className="icon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
              </div>
              <div className="sub-w3l">
                <div className="pull-right">
                  <h6><Link to="/">Login channel</Link></h6>
                </div>
                <div className="clear"></div>
                <div className="right-w3l">
                  <input type="submit" value="Forgot password" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withNotification(ForgotPassword);
