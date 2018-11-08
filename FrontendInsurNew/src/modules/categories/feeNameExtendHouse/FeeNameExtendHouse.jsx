import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import List from './List';

class Channles extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/categories/fee-name-extends-house" component={ List } />
      </Switch>
    );
  }
}
export default withRouter(Channles);