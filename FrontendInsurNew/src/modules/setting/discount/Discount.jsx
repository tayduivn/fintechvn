import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { Error404 } from 'modules';
import Home from './Home';

class Discount extends Component {

  render() {
    
    return (
      <Switch>
        <Route exact path="/settings/discount" component={ Home } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}
export default withRouter(Discount);