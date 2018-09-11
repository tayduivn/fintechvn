//@flow

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import FormLogin from './FormLogin';
import FormForgot from './FormForgot';
import { Link } from 'react-router-dom';

import 'styles/LoginPage.css';

class LoginPage extends Component {
  constructor(props){
    super(props);
    let { session } = this.props;
   
    let redirect = (session.token != null && session.ttl != null);
    if(redirect){
      let timeNow = Math.round(Date.now()) /1000;
      let timeOut = session.created? Math.round(new Date(session.created) / 1000): 0;
      redirect = (  timeOut + session.ttl ) > ( timeNow + 120960) ;
    }

    this.state = {
      isLogin : true,
      redirect
    }
  }

  componentWillMount(){
    document.title = "Login to app";
  }

  setStateLogin = (state) => { 
    this.setState({isLogin: state});
  }

  redirect = () => {
    return (<Redirect to="/" />);
  }

  renderForm = () => {
    let { isLogin } = this.state;
    
    let formHtml = (isLogin) ? (<FormLogin history={this.props.history} />) : (<FormForgot history={this.props.history} />);
    return (
      <main className="mainLogin">
        <h1>Your Account</h1>
        <div className="formLogin">
          <nav className="nav">
            <Link onClick={ () => this.setStateLogin(true) } className={(isLogin === true) ? 'active': ''} to="#">Sign In</Link>
            <Link onClick={ () => this.setStateLogin(false) }  className={(isLogin === false) ? 'active': ''} to="#">Forgot your password?</Link>
          </nav>
          {formHtml}
          
        </div>
      </main>
    );
  }

  render() {
    let { redirect } = this.state;
    
    return ( redirect ? this.redirect() : this.renderForm());
  }
}


let mapStateToProps = (state) => {
  let { session } = state;
  return { session };
};



export default connect(mapStateToProps, null)(LoginPage);
