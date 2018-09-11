// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route, withRouter } from 'react-router-dom';

import AuthRoute from './AuthRoute';
import DashboardAsync from './DashboardAsync';
import { LoginAsync, AccessPasswordAsync } from 'modules';
import * as sessionActions from 'modules/session/actions';
import { actions as profileActions } from 'modules/profile';

import 'semantic-ui-css/semantic.min.css';
import 'styles/App.css';
import 'styles/style.css';

class Routes extends React.Component<Props> {

  getUserToKen = (token) => {
    if(token.length === 64){
      let {profileActions} = this.props;
      profileActions.getUserInToken(token)
        .then(res => {//console.log(res);
          if(res.data == null) this.props.sessionActions.resetSession();
        })
        .catch( () => this.props.sessionActions.resetSession());
    } else this.props.sessionActions.resetSession();
  }

  render() {
    let { session, profile } = this.props;
    let signedIn = (session.token != null);
    
    if (signedIn && profile.info === null) this.getUserToKen(session.token);

    return (
      <Switch>
        <Route path='/login' component={ LoginAsync } />
        <Route path='/access-password/:token' component={ AccessPasswordAsync } />
        <AuthRoute path='/' signedIn={ signedIn } redirect="/login" component={ DashboardAsync } />
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
    profileActions    : bindActionCreators(profileActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));