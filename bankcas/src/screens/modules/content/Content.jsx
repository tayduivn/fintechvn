import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import {
  HomeAsync,
  ProductAsync,
  RequestAsync,
  ProfileAsync,
  PoliciesAsync,
  ReportsAsync
} from 'modules';

import { Error404 } from 'components';

class Content extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={ HomeAsync } />
        <Route path="/product/:id" component={ ProductAsync } />
        <Route path="/requests" component={ RequestAsync } />
        <Route path="/policies" component={ PoliciesAsync } />
        <Route path="/reports" component={ ReportsAsync } />
        <Route path="/profile" component={ ProfileAsync } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default Content;