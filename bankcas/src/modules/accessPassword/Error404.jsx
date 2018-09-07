//@flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Error404 extends Component {

  componentWillMount(){
    document.title = "Page Not found!";
  }

  render() {
    
    return (
      <main className="mainLogin">
        <h1 style={{fontSize: '125px'}}>404</h1>
        <div className="formLogin"  ref={e => this._formSubmit = e}>
        <div className="form">
          <form  >
            <nav style={{textAlign: 'center'}}>
              <Link style={{border: '1px solid orange', padding: '5px 20px', color: '#fff'}}  to="/">Back to home</Link>
            </nav>
          </form>
        </div>
          
        </div>
      </main>
    );
  }
}

export default Error404;
