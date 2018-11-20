import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { Error404 } from 'modules';
import {
  DiscountAsync,
} from './';

class User extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/settings/discount" component={ DiscountAsync } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}
export default withRouter(User);