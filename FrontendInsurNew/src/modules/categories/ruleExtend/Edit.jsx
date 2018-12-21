import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading } from 'components';
import * as ruleExtendActions from './actions';
import { Error404 } from 'modules';
import Form from './Form';

class Edit extends Component {

  componentDidMount(){
    let { profile, ruleExtend, ruleExtendActions } = this.props;

    let where  = { removed: 0, insur_id: profile.info.agency.id};

    if(ruleExtend.ordered.length === 0) ruleExtendActions.fetchAll(null, 0, 0, where);

  }

  formSubmit = (data) => {
    let { ruleExtendActions, notification, match } = this.props;
    let { id } =  match.params;

    ruleExtendActions.updateById(id, data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Update item success');
      })
      .catch(e => notification.e('Error', e.messagse))
  }

  render() {
    let { ruleExtend, match } = this.props;
    if(!!ruleExtend.isWorking) return <Loading />;

    let { id } =  match.params;
    if(!id) return <Error404 />

    let dataGroup = ruleExtend.data[id];
    if(!dataGroup || !!dataGroup.removed) return <Error404 />;

    return (
      <Fragment>
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="white-box">
                <Form
                  dataGroup     = { dataGroup }
                  formSubmit    = { this.formSubmit } />
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

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Edit));