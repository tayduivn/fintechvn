import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route, withRouter } from 'react-router-dom';

import DashboardAsync from './DashboardAsync';
import * as sessionActions from 'modules/session/actions';
import { actions as profileActions } from 'modules/profile';
import { getJsonFromSearch } from 'utils/function';
import { URL_LOGIN } from 'config/constants';
import { Loading } from 'components';

import 'semantic-ui-css/semantic.min.css';
import 'styles/App.css';
import 'styles/style.css';

class Routes extends React.Component<Props> {

  constructor(props){
    super(props);
    this.state = {
      isWorking : true
    }
  }

  componentWillMount(){
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

    if(flag){ 
      profileActions.checkToken(token)
        .then(res => {
          if(!res || res.error) window.location = `${URL_LOGIN}?urlchanel=${window.location.href}`;

          let rem = false;
          if(params.rem) rem = params.rem;
          rem = (rem === 'true') ? true : false;
          profileActions.fetchFinished(res.data);
          sessionActions.setSession({id: token, ttl: null, created: null}, rem);

          if(params.url) window.location = params.url;
          this.setState({isWorking: false});
        })
        .catch( () => window.location = `${URL_LOGIN}?urlchanel=${window.location.href}`)
    } else window.location = `${URL_LOGIN}?urlchanel=${window.location.href}`;
    
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
    profileActions    : bindActionCreators(profileActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));