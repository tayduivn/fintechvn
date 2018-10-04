import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Particles from 'react-particles-js';

import params from 'config/paramsPar';

import {
  HomeAsync,
  Error404,
  ProfileAsync,
  ProductAsync,
  RequestAsync,
  PoliciesAsync
} from 'modules';

class Content extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={ HomeAsync } />
          <Route path="/profile" component={ ProfileAsync } />
          <Route path="/requests" component={ RequestAsync } />
          <Route path="/policies" component={ PoliciesAsync } />
          <Route path="/product" component={ ProductAsync } />
          <Route component={ Error404 } />
        </Switch>
        <Particles params={params} />
      </React.Fragment>
      
    );
  }
}

export default withRouter(Content);