// @flow

import * as React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Menu } from './modules/menu';
import { Sidebar } from './modules/sidebar';
import { Footer } from './modules/footer';
import { Content } from './modules/content';
import { Loading } from 'components';
import * as sessionActions from 'modules/session/actions';
import { actions as profileActions } from 'modules/account';
import bg from 'assets/Images/bg.png';


class DashboardPage extends React.Component {

  render() {

    let { location, profile } = this.props;
    if(profile.isWorking) return <Loading />
    return (
      <Scrollbars style={{ height: "100vh" }}>
        <div id="wrapper">
          <Menu />
          <Sidebar location={location} />
          <div id="page-wrapper" style={{height: "100vh", background: `url(${bg}) top center`, backgroundSize: 'cover', backgroundAttachment: 'fixed'}}>
              <div className="container-fluid">
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
