import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ListData from './ListData';
import { Error404 } from 'components';
import View from './View';

class Request extends Component {
  
  render() {
//	console.log('22222222222222222');
    return (
      <Switch>
        <Route exact path="/requests/:id?" component={ ListData } />
        <Route path="/requests/view/:id" component={ View } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default Request;
