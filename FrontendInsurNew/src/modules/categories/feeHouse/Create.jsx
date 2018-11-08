import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading } from 'components';
import * as feeHouseActions from './actions';
import { actions as yearHouseActions } from 'modules/categories/yearHouse';
import { actions as feeNameExtendHouseActions } from 'modules/categories/feeNameExtendHouse';

import Form from './Form';

class Create extends Component {

  componentDidMount(){
    let { profile, feeHouse, yearHouse, feeNameExtendHouse,
      feeHouseActions, yearHouseActions, feeNameExtendHouseActions } = this.props;

    let where  = { removed: 0, insur_id: profile.info.agency.id};

    if(feeNameExtendHouse.ordered.length === 0) feeNameExtendHouseActions.fetchAll(null, 0, 0, where);
    if(yearHouse.ordered.length === 0) yearHouseActions.fetchAll(null, 0, 0, where);
    if(feeHouse.ordered.length === 0) feeHouseActions.fetchAll(null, 0, 0, where);

  }

  formSubmit = (data) => {
    let { feeHouseActions, profile, notification } = this.props;
    data.insur_id = profile.info.agency.id;


    feeHouseActions.create(data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Create item success');
      })
      .catch(e => notification.e('Error', e.messagse))
  }

  render() {
    let { feeHouse, yearHouse, feeNameExtendHouse, notification } = this.props;
    if(!!feeHouse.isWorking  || !!yearHouse.isWorking || feeNameExtendHouse.isWorking) return <Loading />;
    
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="white-box">
                <Form
                  notification        = { notification }
                  formSubmit          = { this.formSubmit }
                  feeNameExtendHouse  = { feeNameExtendHouse }
                  yearHouse           = { yearHouse } />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  let { feeHouse, yearHouse, feeNameExtendHouse } = state.categories;
  let { profile } = state;

  return { feeHouse, profile, feeNameExtendHouse, yearHouse };
};

let mapDispatchToProps = (dispatch) => {
  return {
    feeHouseActions      : bindActionCreators(feeHouseActions, dispatch),
    yearHouseActions          : bindActionCreators(yearHouseActions, dispatch),
    feeNameExtendHouseActions : bindActionCreators(feeNameExtendHouseActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Create));