import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { Error404 } from 'modules';
import { Home as RevenueIndex } from './revenue';

class User extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/reports/revenue" component={ RevenueIndex } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}
export default withRouter(User);