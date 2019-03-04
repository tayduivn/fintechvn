import React, { Component } from 'react';

import ListPrivilegeG from './privilegeGroup/List';
import ListPrivilegeM from './privilegeModule/List';

class Home extends Component {
  render() {
    return (
      <div className="row">
        <ListPrivilegeG {...this.props} />
        <ListPrivilegeM {...this.props} />
      </div>
    );
  }
}
export default Home;
