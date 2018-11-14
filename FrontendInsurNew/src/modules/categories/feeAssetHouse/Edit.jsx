import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading } from 'components';
import { Error404 } from 'modules';
import * as feeAssetHouseActions from './actions';
import { actions as feeNameExtendHouseActions } from 'modules/categories/feeNameExtendHouse';

import Form from './Form';

class Edit extends Component {

  componentDidMount(){
    let { profile, feeAssetHouse, feeNameExtendHouse,
      feeAssetHouseActions, feeNameExtendHouseActions } = this.props;

    let where  = { removed: 0, insur_id: profile.info.agency.id};

    if(feeNameExtendHouse.ordered.length === 0) feeNameExtendHouseActions.fetchAll(null, 0, 0, where);
    if(feeAssetHouse.ordered.length === 0) feeAssetHouseActions.fetchAll(null, 0, 0, where);

  }

  formSubmit = (data) => {
    let { feeAssetHouseActions, match, notification } = this.props;

    let { id: idfeeAssetHouse } =  match.params;

    feeAssetHouseActions.updateById(idfeeAssetHouse, data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Update item success');
      })
      .catch(e => notification.e('Error', e.messagse))

  }

  render() {
    let { feeAssetHouse, feeNameExtendHouse, notification, match } = this.props;
    if(feeNameExtendHouse.isWorking) return <Loading />;

    let { id: idfeeAssetHouse } =  match.params;
    if(!idfeeAssetHouse) return <Error404 />

    let datafeeAssetHouse = feeAssetHouse.data[idfeeAssetHouse];
    
    if(!datafeeAssetHouse || !!datafeeAssetHouse.removed) return <Error404 />;

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
                  datafeeAssetHouse   = { datafeeAssetHouse } />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  let { feeAssetHouse, feeNameExtendHouse } = state.categories;
  let { profile } = state;

  return { feeAssetHouse, profile, feeNameExtendHouse };
};

let mapDispatchToProps = (dispatch) => {
  return {
    feeAssetHouseActions      : bindActionCreators(feeAssetHouseActions, dispatch),
    feeNameExtendHouseActions : bindActionCreators(feeNameExtendHouseActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Edit));