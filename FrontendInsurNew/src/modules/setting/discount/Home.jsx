import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Form from './Form';

import * as discountHouseActions from './actions';
import { withNotification, Loading } from 'components';

class Home extends Component {

  componentDidMount(){
    let { profile, discountHouseActions } = this.props;

    let where  = { type: "discount", insur_id: profile.info.agency.id};

    discountHouseActions.fetchAll(null, 0, 0, where);

  }

  formSubmit = (data) => {
    let { discount, profile, discountHouseActions, notification } = this.props;
    let id = !!discount && !!discount.item.id ? discount.item.id : null;

    if(!id){
      data = {
        ...data,
        name      : "Discount",
        type      : "discount",
        insur_id  : profile.info.agency.id
      }

      discountHouseActions.create(data)
        .then(res => {
          if(res.error) return Promise.reject(res.error);
          if(!res.data) return Promise.reject({messagse: "unknown error"});
          if(res.data) notification.s('Messagse', 'Create item success');
        })
        .catch(e => notification.e('Error', e.messagse));

    }else {
      discountHouseActions.updateById(id, data)
        .then(res => {
          if(res.error) return Promise.reject(res.error);
          if(!res.data) return Promise.reject({messagse: "unknown error"});
          if(res.data) notification.s('Messagse', 'Update item success');
        })
        .catch(e => notification.e('Error', e.messagse));
    }
  }

  render() {
    let { discount } = this.props;
    if(!!discount.isWorking) return <Loading />;
    
    return (
      <div className="row">
        <div className="col-md-12 col-lg-12 col-sm-12">
          <div className="panel">
            <div className="white-box">
              <Form
                dataDefault = { !!discount.item ? discount.item : null }
                formSubmit  = { this.formSubmit } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { discount } = state.setting;
  let { profile } = state;

  return { discount, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    discountHouseActions      : bindActionCreators(discountHouseActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Home));