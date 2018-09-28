import * as React from 'react';


import 'styles/Loading.css';

class Loading extends React.Component {
  render() {

    return (
      <div id="wrapper-load">
        <div className="spin">
        </div>
    
        <h3 className="loading">Loading...</h3>
      </div>
    );
  }
}

export default Loading;
