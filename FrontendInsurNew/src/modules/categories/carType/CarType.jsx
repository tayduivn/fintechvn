import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import List from './List';
import Create from './Create';
import Edit from './Edit';

class CarType extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/categories/car-type" component={ List } />
        <Route path="/categories/car-type/create" component={ Create } />
        <Route path="/categories/car-type/:id" component={ Edit } />
      </Switch>
    );
  }
}
export default withRouter(CarType);