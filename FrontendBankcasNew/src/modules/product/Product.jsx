import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { Error404 } from 'modules';
import { Motor, Edit, View } from './motor';
import { House } from './house';

class Product extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/product/motor" component={ Motor } />
          <Route exact path="/product/motor/:id" component={ Edit } />
          <Route exact path="/product/motor/view/:id" component={ View } />
          <Route exact path="/product/house" component={ House } />
          <Route component={ Error404 } />
        </Switch>
      </React.Fragment>
      
    );
  }
}

export default withRouter(Product);