import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification } from 'components';
import { actions as profileActions } from 'modules/account';
import { validateForm } from 'utils/validate';
import { Tab } from 'components';
import Info from './Info';
import Password from './Password';

class Right extends Component {

  handelSuccess = (res) => {
    let { notification } = this.props;
    if (res.error !== null)
      notification.e('Messages', res.error.messagse)
    else notification.s('Messages', 'Update success');
  }

  handelError = (err) => {
    let { notification } = this.props;
    notification.e('Messages', err.toString());
  }

  handelSubmit = (data) => {
    let { profile, profileActions } = this.props;

    profileActions.updateUserById(data, profile.info.id)
      .then(res => {
        this.handelSuccess(res);
      })
      .catch(e => this.handelError(e))
  }

  render() {
    let { profile } = this.props;

    let optionTabs = [
      {label: "Infomation", children: <Info profile={profile} validateForm={validateForm} handelSubmit={this.handelSubmit} />},
      {label: "Password", children: <Password profile={profile} validateForm={validateForm} handelSubmit={this.handelSubmit} />},
    ];
    
    return (
      <div className="col-md-8 col-xs-12 m-t-15">
        <div className="white-box">
          <Tab options={ optionTabs } />
        </div>
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
    profileActions : bindActionCreators(profileActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Right));