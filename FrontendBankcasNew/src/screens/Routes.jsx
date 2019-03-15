// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route, withRouter } from 'react-router-dom';

import DashboardAsync from './DashboardAsync';
import * as sessionActions from 'modules/session/actions';
import { actions as profileActions } from 'modules/account'
import { Loading } from 'components';
import { getJsonFromSearch } from 'utils/functions';
import { URL_LOGIN } from 'config/constants';

class Routes extends React.Component<Props> {

  constructor(props){
    super(props);
    this.state = {
      isWorking : true
    }
  }

  async componentWillMount(){
    let { location, session, profileActions, sessionActions } = this.props;
    let { search } = location;

    let params = {};
    if(search) params = getJsonFromSearch(search);

    let flag  = false;
    let token = session.token;

    if(params.token && session.token){
      flag = true;
      if(params.token !== session.token) token = params.token

    } else if(params.token && !session.token){
      flag = true;
      token = params.token
    }else if(!params.token && session.token) flag = true;

    let u = !!params.url ? params.url : window.location.href;

    if(flag){
      let result = await profileActions.checkToken(token);

      if(!result.error && !!result.data){

        let rem = !!params.rem ? ( params.rem === 'true' ? true : false ) : false;
        profileActions.fetchFinished(result.data);
        sessionActions.setSession({id: token, ttl: null, created: null}, rem);

        if(params.url) window.location = `${u}`;

        this.setState({isWorking: false});
      }else{
        sessionActions.resetSession();
        window.location = `${URL_LOGIN}?urlchanel=${u}`;
      }
    } else window.location = `${URL_LOGIN}?urlchanel=${u}`;
  }

  render() {
    if(this.state.isWorking) return <Loading />

    return (
      <Switch>
        <Route component={ DashboardAsync } />
      </Switch>
    );
  }
};


let mapStateToProps = (state) => {
  let { session, profile } = state;
  return { session, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    sessionActions    : bindActionCreators(sessionActions, dispatch),
    profileActions    : bindActionCreators(profileActions, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
