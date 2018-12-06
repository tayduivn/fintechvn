import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading } from 'components';
import * as carTypeActions from './actions';
import { actions as yearsActions } from 'modules/categories/years';
import { actions as seatsActions } from 'modules/categories/seats';

import Form from './Form';

class Create extends Component {

  componentDidMount(){
    let { years, profile, seats,  yearsActions, seatsActions } = this.props;

    let where  = { removed: 0, insur_id: profile.info.agency.id};

    if(years.ordered.length === 0) yearsActions.fetchAll( null, 0, 0, where);
    if(seats.ordered.length === 0) seatsActions.fetchAll(null, 0, 0, where);
    
  }

  formSubmit = (data) => {
    let { carTypeActions, profile, notification } = this.props;
    data.insur_id = profile.info.agency.id;

    carTypeActions.create(data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Create item success');
      })
      .catch(e => notification.e('Error', e.messagse));
  }

  render() {
    let { feeHouse, years, seats, notification } = this.props;
    if(!!feeHouse.isWorking  || !!years.isWorking || seats.isWorking) return <Loading />;
    
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="white-box">
                <Form
                  notification        = { notification }
                  formSubmit          = { this.formSubmit }
                  seats               = { seats }
                  years               = { years } />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  let { feeHouse, years, seats } = state.categories;
  let { profile } = state;

  return { feeHouse, profile, seats, years };
};

let mapDispatchToProps = (dispatch) => {
  return {
    carTypeActions       : bindActionCreators(carTypeActions, dispatch),
    yearsActions          : bindActionCreators(yearsActions, dispatch),
    seatsActions          : bindActionCreators(seatsActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Create));