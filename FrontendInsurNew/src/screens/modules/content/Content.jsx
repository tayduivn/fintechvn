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
  CategoriesAsync,
  RequestAsync,
  Product,
  PoliciesAsync,
  SettingAsync,
  ProductsAsync
} from 'modules';

class Content extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={ HomeAsync } />
          <Route exact path="/products" component={ ProductsAsync } />
          <Route path="/users" component={ UserAsync } />
          <Route path="/profile" component={ ProfileAsync } />
          <Route path="/groups" component={ GroupsAsync } />
          <Route path="/categories" component={ CategoriesAsync } />
          <Route path="/requests" component={ RequestAsync } />
          <Route path="/product" component={ Product } />
          <Route path="/policies" component={ PoliciesAsync } />
          <Route path="/settings" component={ SettingAsync } />
          <Route component={ Error404 } />
        </Switch>
        <Particles params={params} />
      </React.Fragment>
      
    );
  }
}

export default withRouter(Content);