import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading } from 'components';
import * as ruleExtendActions from './actions';

import Form from './Form';

class Create extends Component {

  componentDidMount(){
    let { profile, ruleExtend, ruleExtendActions } = this.props;

    let where  = { removed: 0, insur_id: profile.info.agency.id};

    if(ruleExtend.ordered.length === 0) ruleExtendActions.fetchAll(null, 0, 0, where);

  }

  formSubmit = (data) => {
    let { ruleExtendActions, profile, notification } = this.props;
    data.insur_id = profile.info.agency.id;

    ruleExtendActions.create(data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Create item success');
      })
      .catch(e => notification.e('Error', e.messagse))
  }

  render() {
    let { ruleExtend } = this.props;
    if(!!ruleExtend.isWorking) return <Loading />;
    
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="white-box">
                <Form
                  formSubmit          = { this.formSubmit } />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  let { ruleExtend } = state.categories;
  let { profile } = state;

  return { profile, ruleExtend };
};

let mapDispatchToProps = (dispatch) => {
  return {
    ruleExtendActions     : bindActionCreators(ruleExtendActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Create));