import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Form from './Form';

import * as settingActions from './../actions';
import { withNotification, Loading } from 'components';

class Home extends Component {

  componentDidMount(){
    let { profile, settingActions } = this.props;

    let where  = { type: "provision", insur_id: profile.info.agency.id};

    settingActions.fetchAll(null, 0, 0, where);

  }

  formSubmit = (data) => {
    let { setting, profile, settingActions, notification } = this.props;
    let id = !!setting && !!setting.item.provision ? setting.item.provision.id : null;
    
    let dt = { extra: data }
    if(!id){
      dt = {
        ...dt,
        name      : "Provision",
        type      : "provision",
        insur_id  : profile.info.agency.id
      }

      settingActions.create(dt)
        .then(res => {
          if(res.error) return Promise.reject(res.error);
          if(!res.data) return Promise.reject({messagse: "unknown error"});
          if(res.data) notification.s('Messagse', 'Create item success');
        })
        .catch(e => notification.e('Error', e.messagse));

    }else {
      settingActions.updateById(id, dt)
        .then(res => {
          if(res.error) return Promise.reject(res.error);
          if(!res.data) return Promise.reject({messagse: "unknown error"});
          if(res.data) notification.s('Messagse', 'Update item success');
        })
        .catch(e => notification.e('Error', e.messagse));
    }
  }

  render() {
    let { setting } = this.props;
    if(!!setting.isWorking) return <Loading />;
    let dataDefault = !!setting.item.provision ? setting.item.provision : null;

    return (
      <div className="row">
        <div className="col-md-12 col-lg-12 col-sm-12">
          <div className="panel">
            <div className="white-box">
              <Form
                dataDefault = { dataDefault }
                formSubmit  = { this.formSubmit } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, setting } = state;

  return { profile, setting };
};

let mapDispatchToProps = (dispatch) => {
  return {
    settingActions      : bindActionCreators(settingActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Home));