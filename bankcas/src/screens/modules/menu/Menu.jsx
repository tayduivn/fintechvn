import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import logo from './logo.jpg';
import { localStorage } from 'utils';
import { KEY_LANG_BANKCAS } from 'config/constants';
import * as sessionActions from 'modules/session/actions';
import { actions as profileActions } from 'modules/profile';

class Menu extends Component {

  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }

  clickMenuActive = () => {
    this.setState({active: !this.state.active});
  }

  handleChangeLanguage = (code) => {
    let { i18n } = this.props;

    localStorage.saveState(KEY_LANG_BANKCAS, {key: code});
    i18n.changeLanguage(code);
  }

  handelSignOut = () => {
    let { sessionActions, profileActions, session } = this.props;
    profileActions.signOut(session.token);
    sessionActions.resetSession()
  }


  render() {
    let { active } = this.state;
    let { t } = this.props;

    return (
      <header className="site-header">
        <div id="buttom-hidden">
          <div className="menu-toggle-area">
            <button onClick={ this.clickMenuActive } id="mobile-menu-toggle" className="button button-header mobile-menu-toggle">
              <svg className="icon-menu" width="26px" height="26px">
                <use xlinkHref="#icon-menu" />
              </svg>
            </button>
          </div>
          <div className="logo">
            <Link to="/">
              {/* <svg className="icon-logo-star" width="26px" height="26px">
                <use xlinkHref="#icon-logo-star" />
              </svg> */}
              <img src={logo} alt="Home" />
            </Link>
          </div>
        </div>
        <div className={`header-middle-area ${((active) ? 'active': '')} `}>
          <nav className="main-nav" id="main-nav">
            <ul>
              <li className="home">
                <Link to="/">
                  <svg className="icon-nav-home" width="26px" height="26px">
                    <use xlinkHref="#icon-nav-home" />
                  </svg>
                  <span>{ t('header:home') }</span>
                </Link>
              </li>
              <li className="almanac">
                <Link to="/requests">
                  <svg className="icon-nav-almanac" width="26px" height="26px">
                    <use xlinkHref="#icon-nav-almanac" />
                  </svg>
                  <span>{ t('header:request') }</span>
                </Link>
              </li>
              <li className="guides">
                <Link to="/policies">
                  <svg className="icon-nav-guide" width="26px" height="26px">
                    <use xlinkHref="#icon-nav-guide" />
                  </svg>
                  <span>{ t('header:policies') }</span>
                </Link>
              </li>
              <li className="snippets">
                <Link to="/reports">
                  <svg className="icon-nav-snippets" width="26px" height="26px">
                    <use xlinkHref="#icon-nav-snippets"></use>
                  </svg>
                  <span>{ t('header:report') }</span>
                </Link>
              </li>
            </ul>

            <div id="menuRight">
              <Dropdown text={t('header:lang')} pointing className='link item'>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={ () => this.handleChangeLanguage('vi') }>{t('header:langVN')}</Dropdown.Item>
                  <Dropdown.Item onClick={ () => this.handleChangeLanguage('en') }>{t('header:langEN')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown style={{marginLeft: '15px'}} text={t('header:user')} pointing className='link item'>
                <Dropdown.Menu>
                  <Dropdown.Item >
                    <Link style={{color : '#000'}} to="/profile">{t('header:profile')}</Link>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={ this.handelSignOut} >{t('header:signout')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

let mapStateToProps = (state) => {
  let { session } = state;
  return { session };
};

let mapDispatchToProps = (dispatch) => {
  return {
    sessionActions    : bindActionCreators(sessionActions, dispatch),
    profileActions    : bindActionCreators(profileActions, dispatch)
  };
};

export default translate('header')(connect(mapStateToProps, mapDispatchToProps)(Menu));