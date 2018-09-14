import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Error404.css';

class Error404 extends Component {

  render() {

    return (
      <div className="center-container">
        <div className="header-w3l error404">
          <h1>Financial Technology</h1>
        </div>
        <div className="main-content-agile">
          <div className="sub-main-w3">	
            <div className="wthree-pro">
              <h2>Page not found</h2>
            </div>
            <Link to='/' className="notfound">Login</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Error404;
