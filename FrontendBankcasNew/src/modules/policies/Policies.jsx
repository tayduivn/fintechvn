import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ListData from './ListData';
import PrintData from './PrintData';

import { Error404 } from 'modules';

class Request extends Component {
  
  render() {
    return (
      <Switch>
        <Route exact path="/policies" component={ ListData } />
        <Route path="/policies/print/:id" component={ PrintData } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default Request;