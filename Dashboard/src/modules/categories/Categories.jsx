import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { Error404 } from 'modules';
import {
  ChannlesAsync
} from './';

class User extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/categories/channels" component={ ChannlesAsync } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}
export default withRouter(User);