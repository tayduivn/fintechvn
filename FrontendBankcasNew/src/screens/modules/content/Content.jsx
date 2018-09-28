import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Particles from 'react-particles-js';

import params from 'config/paramsPar';

import {
  HomeAsync,
  UserAsync,
  Error404,
  ProfileAsync,
  GroupsAsync,
  CategoriesAsync
} from 'modules';

class Content extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={ HomeAsync } />
          <Route path="/users" component={ UserAsync } />
          <Route path="/profile" component={ ProfileAsync } />
          <Route path="/groups" component={ GroupsAsync } />
          <Route path="/categories" component={ CategoriesAsync } />
          <Route component={ Error404 } />
        </Switch>
        <Particles params={params} />
      </React.Fragment>
      
    );
  }
}

export default withRouter(Content);