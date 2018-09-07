
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import { Error404 } from 'components';
import ListDataCommission from './commission/ListData';

class Reports extends Component {
  
  render() {
    return (
      <Switch>
        <Route exact path="/reports" component={ ListDataCommission } />
        <Route path="/reports/revenue" component={ ListDataCommission } />
        <Route path="/reports/policyExpired" component={ ListDataCommission } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}

export default Reports;
