//@flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { validateForm } from 'utils/validate';
import { withNotification, Loading } from 'components';

import * as forgotPassActions from './actions';
import Error404 from './Error404';
import 'styles/LoginPage.css';

class ForgotPassword extends Component {
  _passwordInput    = null;
  _repasswordInput  = null;
  _formSubmit       = null;

  constructor(props){
    super(props);
    this.state = {
      isWorking : false,
      data       : null
    }
  }

  componentWillMount(){
    let { match, forgotPassActions } = this.props;
    let { token } = match.params;
    if (token && token.length === 86) {
      forgotPassActions.checkToken(token)
        .then(r => {
          if(r && r.data){
            let { data } = r;
            this.setState({data});
            document.title = "Forgot password";
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
      let { notification, forgotPassActions } = this.props;
      let { data }      = this.state;
      let password     = this._passwordInput.value;
      let repassword   = this._repasswordInput.value;

      if(password === repassword){
        this.setState({isWorking: true});

        forgotPassActions.accessForgotPassword({...data, password})
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
    if (data == null) return (<Error404 />);
    if(isWorking === true) return (<Loading />);
    return (
      <main className="mainLogin">
        <h1>Enter New Password</h1>
        <div className="formLogin">
          <div className="form">
             <form action="" method="post" onSubmit={ this.onSubmitFormLogin } ref={e => this._formSubmit = e} >
                <div className="form-field">
                  <label htmlFor="password">Password</label>
                  <input ref={e => this._passwordInput = e} autoComplete="off" className="form-control" type="password" id="password" />
                </div>
                <div className="form-field">
                  <label htmlFor="repassword">RePassword</label>
                  <input ref={e => this._repasswordInput = e} autoComplete="off" className="form-control" type="password" id="repassword" />
                </div>
                <input type="submit" value="Submit" className="button" />
                <div className="col s12" style={{textAlign: 'center', padding: '10px 0'}}>
                  <Link to="/login" style={{color: '#fff', cursor: 'pointer'}}>Sign In</Link>
                </div>
             </form>
           </div>
        </div>
      </main>
    );
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    forgotPassActions                : bindActionCreators(forgotPassActions, dispatch)
  };
};

export default withNotification(connect(null, mapDispatchToProps)(ForgotPassword));
