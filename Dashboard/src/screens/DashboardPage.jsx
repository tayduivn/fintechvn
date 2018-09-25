// @flow

import * as React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Menu } from './modules/menu';
import { Sidebar } from './modules/sidebar';
import { Breadcrumb } from './modules/breadcrumb';
import { Footer } from './modules/footer';
import { Content } from './modules/content';

import * as sessionActions from 'modules/session/actions';
import { actions as profileActions } from 'modules/account';

class DashboardPage extends React.Component {

  componentWillMount(){
    let { session } = this.props;

    if(session.token && session.token.length === 64){
      let {profileActions} = this.props;
      profileActions.getUserInToken(session.token)
        .then(res => {
          if(res.data == null) this.props.sessionActions.resetSession();
        })
        .catch( () => this.props.sessionActions.resetSession());
    } else this.props.sessionActions.resetSession();
  }

  render() {
    let { location } = this.props;

    return (
      <Scrollbars style={{ height: "100vh" }}>
        <div id="wrapper">
          <Menu />
          <Sidebar location={location} />
          <div id="page-wrapper">
              <div className="container-fluid">
                <Breadcrumb />
                <Content />
              </div>
              <Footer />
          </div>
        </div>
      </Scrollbars>
      
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
