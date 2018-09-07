import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ListData from './ListData';
import { Error404 } from 'components';
import Edit from './Edit';
import Clone from './Clone';
import View from './View';

class Request extends Component {
  
  render() {
    return (
      <Switch>
        <Route exact path="/requests" component={ ListData } />
        <Route path="/requests/edit/:id" component={ Edit } />
        <Route path="/requests/view/:id" component={ View } />
        <Route path="/requests/clone/:id" component={ Clone } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default Request;