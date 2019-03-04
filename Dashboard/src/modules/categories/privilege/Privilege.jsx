import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Home from './Home';

class Channles extends Component {

  render() {
    return (
      <Switch>
        <Route path="/categories/privileges/:idG?" component={ Home } />
      </Switch>
    );
  }
}
export default withRouter(Channles);
