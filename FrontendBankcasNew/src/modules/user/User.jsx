import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import ListUser from './ListUser';

class User extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/users" component={ ListUser } />
      </Switch>
    );
  }
}
export default withRouter(User);