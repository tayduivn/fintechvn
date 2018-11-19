import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { Error404 } from 'modules';
import { Motor, Edit, View, Clone as CloneMotor } from './motor';
import { House, Edit as EditHouse, View as ViewHouse, Clone as CloneHosue } from './house';

class Product extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/product/motor" component={ Motor } />
          <Route exact path="/product/motor/:id" component={ Edit } />
          <Route exact path="/product/motor/view/:id" component={ View } />
          <Route exact path="/product/motor/clone/:id" component={ CloneMotor } />
          <Route exact path="/product/house" component={ House } />
          <Route exact path="/product/house/:id" component={ EditHouse } />
          <Route exact path="/product/house/view/:id" component={ ViewHouse } />
          <Route exact path="/product/house/clone/:id" component={ CloneHosue } />
          <Route component={ Error404 } />
        </Switch>
      </React.Fragment>
      
    );
  }
}

export default withRouter(Product);