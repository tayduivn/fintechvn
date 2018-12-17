import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import { withNotification } from 'components';
import { actions as profileActions } from 'modules/account';
import * as sessionActions from 'modules/session/actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { URL_LOGIN, KEY_LANG_BANKCAS, URL_BACK_INSUR, URL_BASE } from 'config/constants';
import { localStorage } from 'utils';
import Router from './Routes';
import Item from './Item';
import users                from 'assets/Images/user.jpg';
import $ from 'jquery';
import io from "socket.io-client";
import { notiSound } from 'utils/functions';

class Sidebar extends Component {
	
	constructor(props){
		super(props);
		
		this.socket = io(URL_BACK_INSUR, {transports: ['polling']});
		this.socketBC = io(URL_BASE, {transports: ['polling']});

	}
	
	handelSignOut = (e) => {
		e.preventDefault();
		
		let { sessionActions, profileActions, session } = this.props;
		profileActions.signOut(session.token);
		sessionActions.resetSession();
		window.location = `${URL_LOGIN}?urlchanel=${window.location.href}`;
	}

	componentDidMount(){
		let { profile, productDetailActions, notification } = this.props;
		
		this.socket.on('connect', () => {
			this.socket.emit('setSocketId', profile.info.id);
			
			this.socket.on('SERVER_SEND_REQUEST_TO_CLIENT', (data) => {
				notification.s("Message", "You have new message");
				notiSound();
        !!data && productDetailActions.fetchFinished([data])
			});
		})

		this.socketBC.on('connect', () => {
			this.socketBC.emit('setSocketId', profile.info.id);
			
			this.socketBC.on('SERVER_BANKCAS_UPDATE_REQUEST', (data) => {
				let { location } = this.props;
				if(!!location){
					let { pathname } = location;
					if(!!pathname && !!data){
						let { id } =  data;
						if(new RegExp(`.*${id}`).test(pathname)){
							
							let a = window.confirm("Dữ liệu thay đổi, bạn có muốn update");
							if(!!a) window.location.reload();
						}
					}
				}
				
        !!data && productDetailActions.fetchFinished([data])
			});

			this.socketBC.on('SERVER_BANKCAS_DELETE_REQUEST', (id) => {
        !!id && productDetailActions.delFinished(id)
			});
			
		})
		
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
			
			$('ul.nav-second-level li.active').parents('li.subMenu').addClass('active');
		});

		$('ul.nav-second-level').click(function(e){
			$(this).parents('li.subMenu').addClass('active').find('a').first().addClass('active');
		});
	}

	clickCloseMenu = () => $('body').removeClass('show-sidebar');

	handleChangeLanguage = (code) => () => {
		let { i18n } = this.props;

    localStorage.saveState(KEY_LANG_BANKCAS, {key: code});
    i18n.changeLanguage(code);
	}

  render() {
		let { profile, t } = this.props;
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
							<Link to="#" className="waves-effect">
								<img src={users} alt="user-img" className="img-circle" />
							<span className="hide-menu"> {fullName}<span className="fa arrow" /></span>
							</Link>
							<ul className="nav nav-second-level collapse" aria-expanded="false" >
								<li><Link  to="/profile"><i className="ti-user"></i> {t('menu:btnProfile')}</Link></li>
								<li><Link onClick={ this.handelSignOut} to="#"><i className="fa fa-power-off"></i> {t('menu:btnLogout')}</Link></li>
							</ul>
						</li>
						{
							Router.map((e, i) => {
								return (
									<Item t={t} profile={profile} location={this.props.location} key={i} data={e} />
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
								<li><Link  to="/profile"><i className="ti-user"></i> {t('menu:btnProfile')}</Link></li>
								<li><Link onClick={ this.handelSignOut} to="#"><i className="fa fa-power-off"></i> {t('menu:btnLogout')}</Link></li>
							</ul>
						</li>

						<li className="nav navbar-top-links nav-pro navbar-right pull-right">
								<Link style={{paddingTop: `0`, paddingBottom: 0}} className=" profile-pic"  to="#">
									<span >{t('menu:langbtn')} </span>
								</Link>
							<ul style={{right: 'auto', left: 0, width: '170px'}} className="nav nav-second-level dropdown-user animated flipInY">
								<li><Link onClick={ this.handleChangeLanguage('vi')} to="#" ><i className="fa fa-language m-r-5"></i>{t('menu:langvi')}</Link></li>
								<li><Link onClick={ this.handleChangeLanguage('en')} to="#"><i className="fa fa-language m-r-5"></i> {t('menu:langen')}</Link></li>
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
    sessionActions    			: bindActionCreators(sessionActions, dispatch),
    profileActions    			: bindActionCreators(profileActions, dispatch),
    productDetailActions    : bindActionCreators(productDetailActions, dispatch),
  };
};

export default withNotification(translate(['menu'])(connect(mapStateToProps, mapDispatchToProps)(Sidebar)));