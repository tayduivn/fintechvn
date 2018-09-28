import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';

import Left from './Left';
import Right from './Right';

class Profile extends Component {

  componentWillMount(){
    this.props.breadcrumbActions.set({
      page_name: 'Edit profile',
      breadcrumb: [{
        name: "Profile",
        liClass: "active"
      }]
    });
  }

  render() {
    let { profile } = this.props;

    return (
      <div className="row">
        <Left profile={profile} />
        <Right profile={profile} />
      </div>
    );
  }
}


let mapStateToProps = (state) => {
  let { profile } = state;
  return { profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Profile));