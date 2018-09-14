import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { validateForm } from 'utils/validate';
import { withNotification, Loading } from 'components';
import * as loginActions from './../actions';
import { Error404 } from 'components';

class LoginPage extends Component {
  _repasswordInput     = null;
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
      loginActions.checkToken(token)
        .then(r => {
          if(r && r.data){
            let { data } = r;
            console.log(data);
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

        loginActions.accessForgotPassword({...data, password})
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

  handleError = (err) => {
    let { notification } = this.props;
    notification.e('Message', err.messagse);
  }

  render() {

    let { data, isWorking } = this.state;

    if (data == null) return (<Error404 />);
    if(isWorking === true) return (<Loading />);

    return (
      <div className="center-container">
        <div className="header-w3l">
          <h1>Financial Technology</h1>
        </div>
        <div className="main-content-agile">
          <div className="sub-main-w3">	
            <div className="wthree-pro">
              <h2>Access password</h2>
            </div>
            <form onSubmit={ this.onSubmitFormLogin } ref={e => this._formSubmit = e}>

              

              <div className="pom-agile">
                <input style={{marginTop: '.7em'}} ref={e => this._passwordInput = e} id="password" placeholder="Password" name="password" className="pass form-control" type="password" required="" />
                <span className="icon2"><i className="fa fa-unlock" aria-hidden="true"></i></span>
              </div>

              <div className="pom-agile">
                <input style={{marginTop: '.7em'}} ref={e => this._repasswordInput = e} id="repassword" placeholder="RePassword" name="respassword" className="pass form-control" type="password" required="" />
                <span className="icon2"><i className="fa fa-unlock" aria-hidden="true"></i></span>
              </div>

              <div className="sub-w3l">
            
              <div className="pull-right">
                <h6><Link to="/">Login to channel</Link></h6>
              </div>
                <div className="clear"></div>
                <div className="right-w3l">
                  <input type="submit" value="Change password" />
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
