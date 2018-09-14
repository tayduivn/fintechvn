import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { validateForm } from 'utils/validate';
import { withNotification, Loading } from 'components';
import * as loginActions from './actions';

class FormForgot extends Component {
  _emailInput     = null;
  _formSubmit     = null;

  constructor(props){
    super(props);
    this.state = {
      isWorking: false
    }
  }

  handleSuccess = (res) => {
    let { notification }  = this.props;
    let {error, data}     = res;

    if(error != null){
      notification.e('Messages', error.message);
      this.setState({isWorking: false});
    }else if(data != null){
      let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/access-password/${data.mailToken}` ;
      let html = `You are forgot password.
            <a href='${url}'>Click here to forgot password</a>`;
      let dt = {
            to: data.email,
            subject: 'Forgot Password',
            html
          };
      
        this.props.loginActions.sendEmail(dt)
          .then(r =>  {
            if (!r) notification.e('Messages', 'Disconnect server');
            else{
              if(r.error)  notification.e('Messages', r.error.message);
              else if(r.data) notification.s('Messages', 'Forgot password success. Please check email !');
            }
            this.setState({isWorking: false});
          })
          .catch( () => {
            this.setState({isWorking: false});
          })
      
    }else{
      notification.e('Messages', 'Server ');
      this.setState({isWorking: false});
    }
  }

  handleError = () => {
    let { notification } = this.props;
    this.setState({isWorking: false});
    notification.e('Messages', 'Disconnect server');
  }

  onSubmitFormLogin = (e) => {
    e.preventDefault();

    let valid = validateForm(this._formSubmit, [{id: 'email', rule: 'email:7:200'}]);

    if(valid){
      let email     = this._emailInput.value;
      this.setState({isWorking: true});
   
      this.props.loginActions.forgotPassword(email)
        .then(res =>  this.handleSuccess(res)).catch(e => this.handleError());
    }
  }

  render() {
    if(this.state.isWorking) return (<Loading />);
    
    return (
      <form method="post"  onSubmit={ this.onSubmitFormLogin }  >
        <div className="form-field">
          <label htmlFor="email">Email Address</label>
          <input ref={e => this._emailInput = e} className="form-control" type="email" id="email" name="email" />
        </div>
        <input type="submit" value="Forgot your password" name="submit" className="button" />
      </form>
    );
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    loginActions                : bindActionCreators(loginActions, dispatch)
  };
};

export default withNotification(connect(null, mapDispatchToProps)(FormForgot));
