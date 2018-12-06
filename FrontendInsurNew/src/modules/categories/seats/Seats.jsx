import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import List from './List';

class Seats extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/categories/seats" component={ List } />
      </Switch>
    );
  }
}
export default withRouter(Seats);