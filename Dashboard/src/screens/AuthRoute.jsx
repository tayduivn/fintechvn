// @flow

import * as React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';

class AuthRoute extends React.Component {
  renderComponent = () => {
    let { component: Component, childProps, ...rest } = this.props;
    return (<Component { ...childProps } {...rest}/>);
  };

  redirect = (url: string) => {
    return (<Redirect to={ url } />);
  }

  render() {
    let { signedIn, redirect, component, childProps, ...rest } = this.props;
    return ( <Route { ...rest } render={ props => signedIn ? this.renderComponent() : this.redirect(redirect) } />);
  }
}

export default withRouter(AuthRoute);
