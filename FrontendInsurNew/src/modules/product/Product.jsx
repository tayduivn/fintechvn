import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { Error404 } from 'modules';
import { View } from './motor';

class Product extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/product/motor/:id" component={ View } />
          <Route component={ Error404 } />
        </Switch>
      </React.Fragment>
      
    );
  }
}

export default withRouter(Product);