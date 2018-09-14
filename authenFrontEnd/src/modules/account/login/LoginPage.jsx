import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { validateForm } from 'utils/validate';
import { withNotification, Loading } from 'components';
import * as loginActions from './../actions';
import { getJsonFromSearch } from 'utils/function';

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

  handleSuccess = (res, remember) => {
    
    let { notification, location } = this.props;
    
    if( null != res.error){
      notification.e('Message', res.error.messagse);
    }else if(null != res.data){

      let { urlchanel } = getJsonFromSearch(location.search);

      let { id, path } = res.data;
      let urlPath = path;
      let fl = true;

      if(urlchanel){
        fl = false;
        urlPath = urlchanel;
        if(urlchanel.indexOf(path) !== -1) fl = true;
      }

      if(fl){
        let url = `${path}/login/?token=${id}&url=${urlPath}&rem=${remember}`;
        window.location = url;
      }else notification.e('Message', 'User not channel');

    }else{
      notification.e('Message', 'Login fail');
    }
  }

  handleError = (err) => {
    let { notification } = this.props;
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
      
      if(email && password ){
        email     = email.trim();
        password  = password.trim();
       
        if(email.length >= 7  && email.length <= 200 && password.length >=6 && password.length <= 32){
          this.setState({isWorking: true});

          loginActions.login(email, password)
            .then(res => this.handleSuccess(res, remember))
            .catch(err => this.handleError(err))
            .finally( () => this.setState({isWorking: false}))

        }
      }
    }
  }

  render() {

    let { isWorking } = this.state;

    if(isWorking) return <Loading />

    return (
      <div className="center-container">
        <div className="header-w3l">
          <h1>Financial Technology</h1>
        </div>
        <div className="main-content-agile">
          <div className="sub-main-w3">	
            <div className="wthree-pro">
              <h2>Login channel</h2>
            </div>
            <form onSubmit={ this.onSubmitFormLogin } ref={e => this._formSubmit = e}>
              <div className="pom-agile">
                <input ref={e => this._emailInput = e} type="email" id="email" name="email" placeholder="E-mail"className="user form-control" required="" />
                <span className="icon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
              </div>
              <div className="pom-agile">
                <input style={{marginTop: '.7em'}} ref={e => this._passwordInput = e} id="password" placeholder="Password" name="Password" className="pass form-control" type="password" required="" />
                <span className="icon2"><i className="fa fa-unlock" aria-hidden="true"></i></span>
              </div>
              <div className="sub-w3l">
              <div className="pull-left">
                <input ref={e => this._rememberInput = e} type="checkbox" name="one" id="one" />
		            <label htmlFor="one">Remember password.</label>
              </div>
              <div className="pull-right">
                <h6><Link to="/forgot-password">Forgot Password?</Link></h6>
              </div>
                <div className="clear"></div>
                <div className="right-w3l">
                  <input type="submit" value="Login" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withNotification(LoginPage);
