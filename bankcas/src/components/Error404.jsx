import * as React from 'react';

import './Error404.css';

class Error404 extends React.Component {
  componentWillMount(){
    document.title = "Page not found!";
  }
  
  render() {

    return (
      <div id="error404">
        <h1 className="text-danger">404</h1>
        <h3 className="text-uppercase">Page Not Found !</h3>
      </div>
    );
  }
}

export default Error404;
