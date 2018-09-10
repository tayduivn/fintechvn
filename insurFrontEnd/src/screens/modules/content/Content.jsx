import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import {
  HomeAsync,
  RequestAsync,
  ProfileAsync,
  PoliciesAsync
} from 'modules';

import { Error404 } from 'components';

class Content extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={ HomeAsync } />
        <Route path="/requests/:id?" component={ RequestAsync } />
        <Route path="/policies" component={ PoliciesAsync } />
        <Route path="/profile" component={ ProfileAsync } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default Content;