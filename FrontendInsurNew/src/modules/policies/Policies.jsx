import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ListData from './ListData';
import { Error404 } from 'modules';
import PrintData from './PrintData';

class Policies extends Component {
  
  render() {
    return (
      <Switch>
        <Route exact path="/policies" component={ ListData } />
        <Route path="/policies/print/motor/:id" component={ PrintData } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default Policies;