import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { Error404 } from 'modules';
import {
  ChannlesAsync,
  AgencyAsync
} from './';

class User extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/categories/channels" component={ ChannlesAsync } />
        <Route exact path="/categories/agency" component={ AgencyAsync } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}
export default withRouter(User);