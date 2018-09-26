import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import List from './List';

class Agency extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/categories/agency" component={ List } />
      </Switch>
    );
  }
}
export default withRouter(Agency);