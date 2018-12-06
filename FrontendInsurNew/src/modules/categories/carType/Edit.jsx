import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withNotification, Loading } from 'components';
import * as carTypeActions from './actions';
import { actions as yearsActions } from 'modules/categories/years';
import { actions as seatsActions } from 'modules/categories/seats';
import { Error404 } from 'modules';
import Form from './Form';

class Edit extends Component {

  componentDidMount(){
    let { years, profile, seats, carType, yearsActions, seatsActions, carTypeActions } = this.props;

    let where  = { removed: 0, insur_id: profile.info.agency.id};

    if(years.ordered.length === 0) yearsActions.fetchAll( null, 0, 0, where);
    if(seats.ordered.length === 0) seatsActions.fetchAll(null, 0, 0, where);
    if(carType.ordered.length === 0) carTypeActions.fetchAll(null, 0, 0, where);
    
  }

  formSubmit = (data) => {
    let { carTypeActions, notification, match } = this.props;
    let { id } =  match.params;


    carTypeActions.updateById(id, data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Update item success');
      })
      .catch(e => notification.e('Error', e.messagse))
      .finally( this.setState({open: false, idUpdate: null, idDelete: null}));
  }

  render() {
    let { carType, years, seats, notification, match } = this.props;
    if( !!years.isWorking || seats.isWorking || !!carType.isWorking) return <Loading />;
    
    let { id } =  match.params;
    if(!id) return <Error404 />

    let dataDefault = carType.data[id];
    if(!dataDefault || !!dataDefault.removed) return <Error404 />;

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
                  dataDefault         = { dataDefault }
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
  let { years, seats, carType } = state.categories;
  let { profile } = state;

  return { profile, seats, years, carType };
};

let mapDispatchToProps = (dispatch) => {
  return {
    carTypeActions       : bindActionCreators(carTypeActions, dispatch),
    yearsActions          : bindActionCreators(yearsActions, dispatch),
    seatsActions          : bindActionCreators(seatsActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Edit));