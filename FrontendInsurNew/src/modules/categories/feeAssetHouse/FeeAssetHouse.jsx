import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import List from './List';
import Create from './Create';
import Edit from './Edit';

class FeeHouse extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/categories/fee-asset-house" component={ List } />
        <Route path="/categories/fee-asset-house/edit/:id" component={ Edit } />
        <Route exact path="/categories/fee-asset-house/create" component={ Create } />
      </Switch>
    );
  }
}
export default withRouter(FeeHouse);