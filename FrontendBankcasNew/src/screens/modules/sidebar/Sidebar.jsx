import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { actions as profileActions } from 'modules/account';
import * as sessionActions from 'modules/session/actions';
import { URL_LOGIN } from 'config/constants';
import Router from './Routes';
import Item from './Item';
import users                from 'assets/Images/user.jpg';
import $ from 'jquery';

class Sidebar extends Component {
	
	handelSignOut = (e) => {
		e.preventDefault();
		
		let { sessionActions, profileActions, session } = this.props;
		profileActions.signOut(session.token);
		sessionActions.resetSession();
		window.location = `${URL_LOGIN}?urlchanel=${window.location.href}`;
	}

	componentDidMount(){
		$('ul.nav-second-level li.active').parents('li.subMenu').addClass('active').find('a').first().addClass('active');

		$('show-sidebar #side-menu').find("li.active").has("ul").children("ul").show();
		$('show-sidebar #side-menu').find("li").not(".active").has("ul").children("ul").hide();

		$('#side-menu li.subMenu a').click(function(e){
			let $this = $(this).parent();
	
			if($this.hasClass('subMenu')){
				$('#side-menu li.subMenu a').removeClass('active');
				$(this).addClass('active');

				if($this.hasClass('active')){
					$this.removeClass("active").children("ul").hide(300);
				}else{ 
					$this.addClass("active").children("ul").show(300);
				}
				$('show-sidebar #side-menu').find('li.active').not($this).removeClass('active').children("ul").hide(300);
			}
			
		});
	}

	clickCloseMenu = () => {
		$('body').removeClass('show-sidebar');
	}

  render() {
		let { profile } = this.props;
		let email = (profile.info) ? profile.info.email : "";
    let fullName = (profile.info) ? `${profile.info.firstname} ${profile.info.lastname}` : "";

    return (
		<div className="navbar-default sidebar" role="navigation">
        <div className="sidebar-nav">
					<div className="sidebar-head">
						<h3>
							<span onClick={ this.clickCloseMenu } className="fa-fw open-close">
								<i className="ti-menu hidden-xs" />
								<i className="ti-close visible-xs" />
							</span>
						<span className="hide-menu">Navigation</span></h3>
					</div>
          <ul className="nav" id="side-menu">
						<li className="user-pro subMenu">
							<a href="javascript:void(0)" className="waves-effect">
								<img src={users} alt="user-img" className="img-circle" />
							<span className="hide-menu"> {fullName}<span className="fa arrow" /></span>
							</a>
							<ul className="nav nav-second-level collapse" aria-expanded="false" >
								<li><Link  to="/profile"><i className="ti-user"></i> My Profile</Link></li>
								<li><Link onClick={ this.handelSignOut} to="#"><i className="fa fa-power-off"></i> Logout</Link></li>
							</ul>
						</li>
						{
							Router.map((e, i) => {
								return (
									<Item profile={profile} location={this.props.location} key={i} data={e} />
								)
							})
						}
						<li className="nav navbar-top-links nav-pro navbar-right pull-right">
								<Link style={{paddingTop: `0`, paddingBottom: 0}} className=" profile-pic"  to="#">
										<img src={users} alt="user-img" width="36" className="img-circle autoImage-1" />
										<b className="hidden-xs">{fullName}</b><span className="caret"></span> 
								</Link>
							<ul className="nav nav-second-level dropdown-user animated flipInY">
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
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);