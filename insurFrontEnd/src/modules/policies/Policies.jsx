import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ListData from './ListData';
import { Error404 } from 'components';
import View from './View';
import PrintDocs from './PrintDocs';

class Policies extends Component {
  
  render() {
    return (
      <Switch>
        <Route exact path="/policies" component={ ListData } />
        <Route path="/policies/print/:id" component={ PrintDocs } />
        <Route path="/policies/view/:id" component={ View } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default Policies;