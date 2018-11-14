import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { Error404 } from 'modules';
import {
  YearsAsync,
  AgencyAsync,
  SeatsPayloadAsync,
  RuleExtendAsync,
  YearHouseAsync,
  FeeNameExtendHouseAsync,
  FeeHouseAsync,
  FeeAssetHouseAsync
} from './';

class User extends Component {

  render() {
    return (
      <Switch>
        <Route exact path="/categories/years" component={ YearsAsync } />
        <Route exact path="/categories/agency" component={ AgencyAsync } />
        <Route exact path="/categories/seats-payload" component={ SeatsPayloadAsync } />
        <Route exact path="/categories/rule-extends" component={ RuleExtendAsync } />
        <Route exact path="/categories/year-house" component={ YearHouseAsync } />
        <Route exact path="/categories/fee-name-extends-house" component={ FeeNameExtendHouseAsync } />
        <Route path="/categories/fee-house" component={ FeeHouseAsync } />
        <Route path="/categories/fee-asset-house" component={ FeeAssetHouseAsync } />
        <Route component={ Error404 } />
      </Switch>
    );
  }
}
export default withRouter(User);