import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { NotifycationProvider } from 'components';
import Routes from './Routes';
import 'styles/styles.css';

class App extends Component {
  render() {
    return (
      <NotifycationProvider>
        <Router>
          <Routes />
        </Router>
      </NotifycationProvider>
      
    );
  }
}

export default App;
