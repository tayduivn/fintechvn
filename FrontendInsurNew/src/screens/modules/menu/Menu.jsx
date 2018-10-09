import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as sessionActions from 'modules/session/actions';
import { actions as profileActions } from 'modules/account';
import { URL_LOGIN } from 'config/constants';
import $ from 'jquery';

import users                from 'assets/Images/user.jpg';

class Menu extends Component {

  handelSignOut = (e) => {
    e.preventDefault();
    
    let { sessionActions, profileActions, session } = this.props;
    profileActions.signOut(session.token);
    sessionActions.resetSession();
    window.location = `${URL_LOGIN}?urlchanel=${window.location.href}`;
  }

  toggetClickmenu = () =>{
    $('body').toggleClass('show-sidebar');
  }

  render() {
    let { profile } = this.props;
    let email = (profile.info) ? profile.info.email : "";
    let fullName = (profile.info) ? `${profile.info.firstname} ${profile.info.lastname}` : "";

    return (
      <nav className="navbar navbar-default navbar-static-top m-b-0">
        <div className="navbar-header">
            <ul className="nav navbar-top-links navbar-left">
                <li><Link  onClick={this.toggetClickmenu} to="#" className="open-close waves-effect waves-light visible-xs"><i className="ti-close ti-menu"></i></Link></li>
                <li className="dropdown">
                    <Link className="dropdown-toggle waves-effect waves-light" data-toggle="dropdown" to="#"> <i className="mdi mdi-gmail"></i>
                        <div className="notify">
                        <span className="heartbit"></span> <span className="point"></span>
                        </div>
                    </Link>
                    <ul className="dropdown-menu mailbox animated bounceInDown">
                        <li>
                            <div className="drop-title">You have 4 new messages</div>
                        </li>
                        <li>
                            <div className="message-center">
                                <Link to="#">
                                    <div className="user-img">
                                    <img src={users} alt="user" className="img-circle" /> 
                                    <span className="profile-status online pull-right"></span>
                                    </div>
                                    <div className="mail-contnet">
                                        <h5>Pavan kumar</h5> <span className="mail-desc">Just see the my admin!</span> <span className="time">9:30 AM</span> </div>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <Link className="text-center" to="#"> <strong>See all notifications</strong> <i className="fa fa-angle-right"></i> </Link>
                        </li>
                    </ul>
                </li>

            </ul>
            <ul className="nav navbar-top-links navbar-right pull-right">
                <li>
                    <form role="search" className="app-search hidden-sm hidden-xs m-r-10">
                        <input type="text" placeholder="Search..." className="form-control" /> <Link to=""><i className="fa fa-search"></i></Link> </form>
                </li>
                <li className="dropdown">
                    <Link className="dropdown-toggle profile-pic" data-toggle="dropdown" to="#">
                        <img src={users} alt="user-img" width="36" className="img-circle autoImage-1" />
                        <b className="hidden-xs">{fullName}</b><span className="caret"></span> 
                    </Link>
                    <ul className="dropdown-menu dropdown-user animated flipInY">
                    
                        <li>
                            <div className="dw-user-box">
                                <div className="u-img">
                                    <img src={users} alt="user-img" width="36" className="img-circle autoImage-1" />
                                </div>
                                <div className="u-text">
                                    <h4>{fullName}</h4>
                                    <p className="text-muted" style={{textOverflow: 'hidden'}}>{email}</p>
                                </div>
                            </div>
                        </li>
                        <li role="separator" className="divider"></li>
                        <li><Link  to="/profile"><i className="ti-user"></i> My Profile</Link></li>
                        <li><Link onClick={ this.handelSignOut} to="#"><i className="fa fa-power-off"></i> Logout</Link></li>
                    </ul>
                </li>
                
            </ul>
        </div>
    </nav>
    );
  }
}

let mapStateToProps = (state) => {
  let { profile, session } = state;
  return { profile, session };
};

let mapDispatchToProps = (dispatch) => {
  return {
    sessionActions    : bindActionCreators(sessionActions, dispatch),
    profileActions    : bindActionCreators(profileActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);