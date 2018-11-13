import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { Error404 } from 'modules';
import { View } from './motor';
import { View as ViewHouse } from './house';

class Product extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/product/motor/:id" component={ View } />
          <Route path="/product/house/:id" component={ ViewHouse } />
          <Route component={ Error404 } />
        </Switch>
      </React.Fragment>
      
    );
  }
}

export default withRouter(Product);