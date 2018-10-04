import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { Error404 } from 'modules';
import { Motor, Edit } from './motor';

class Product extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/product/motor" component={ Motor } />
          <Route path="/product/motor/:id" component={ Edit } />
          <Route component={ Error404 } />
        </Switch>
      </React.Fragment>
      
    );
  }
}

export default withRouter(Product);