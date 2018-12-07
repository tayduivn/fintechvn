import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import List from './List';

class ProductName extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/categories/car-type" component={ List } />
      </Switch>
    );
  }
}
export default withRouter(ProductName);