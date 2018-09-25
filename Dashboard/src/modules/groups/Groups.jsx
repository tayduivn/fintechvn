import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import List from './List';

class User extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/groups" component={ List } />
      </Switch>
    );
  }
}
export default withRouter(User);