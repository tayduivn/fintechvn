// @flow

import * as React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Particles from 'react-particles-js';

import { LoginPage, ForgotPassword, AccessPassword } from 'modules/account';
import params from './paramsPar';

import { Error404} from 'components';

class Routes extends React.Component<Props> {

  render() {

    return (
      <React.Fragment>
        <Switch>
          <Route exact path='/' component={ LoginPage } />
          <Route path='/forgot-password' component={ ForgotPassword } />
          <Route path='/access-password/:token' component={ AccessPassword } />
          <Route component={ Error404 } />
        </Switch>
        <Particles params={params} />
      </React.Fragment>
    );
  }
};


export default withRouter(Routes);