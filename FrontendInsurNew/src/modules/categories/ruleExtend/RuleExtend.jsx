import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import List from './List';
import Create from './Create';
import Edit from './Edit';

class Channles extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/categories/rule-extends" component={ List } />
        <Route path="/categories/rule-extends/create" component={ Create } />
        <Route path="/categories/rule-extends/:id" component={ Edit } />
      </Switch>
    );
  }
}
export default withRouter(Channles);