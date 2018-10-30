import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Scrollbars } from 'react-custom-scrollbars';

import * as sessionActions from 'modules/session/actions';
import { actions as profileActions } from 'modules/account';
import { actions as productDetailActions } from 'modules/productDetail';
import { actions as messageActions } from 'modules/categories/messages';
import { URL_LOGIN, URL_BACK_BANKCAS } from 'config/constants';
import { isEmpty, getJsonFromSearch } from 'utils/functions';
import { convertTimeMess } from 'utils/format';
import $ from 'jquery';

import users                from 'assets/Images/user.jpg';
import io from "socket.io-client";

class Menu extends Component {

  constructor(props){
    super(props);
    this.state = {
      countNoti    : 0,
      idNoti       : null
    }

    this.socket = io(URL_BACK_BANKCAS);
  }

  onScrollFrame = (e) => {
    if( e.top === 1){
        let { messageActions, messages, profile } = this.props;
        let litmit = messages.ordered.length;

        messageActions.fetchMore({
          include: [
            {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          ],
          order: "id DESC"
        },litmit , 15, {
          agencyID: profile.info.agency.id
        })
    }
  }

  componentDidUpdate(){
    let { location, messages, messageActions } = this.props;
    let countNoti = 0;

    let { search } = location;
    if(!!search && search !== ""){
      let param = getJsonFromSearch(search);

      if(!!param && !!param.noti && this.state.idNoti !== param.noti)
        messageActions.updateById(param.noti, {status: 1})
        .finally(() => this.setState({idNoti: param.noti}))
    }

    if(messages.ordered.length > 0 && !isEmpty(messages.data)){
        let { ordered, data } = messages;
        for(let id of ordered) !!data[id] && data[id].status === 0 && ++countNoti;
        if(this.state.countNoti !== countNoti) this.setState({countNoti})
      }
  }

  componentDidMount(){
    let { profile, messages, productDetailActions, messageActions } = this.props;
    
    if(messages.ordered.length === 0){
      messageActions.fetchAll({
          include: [
            {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          ],
          order: "id DESC"
      },0 , 15, {
        agencyID: profile.info.agency.id
      })
  }
    
    this.socket.on('connect', () => {
      this.socket.emit('setSocketId', profile.info.id);
      this.socket.on('SERVER_SEND_MESS_TO_CLIENT', (data) =>{
        !!data && messageActions.fetchFinished([data])
      });

      this.socket.on('SERVER_SEND_REQUEST_TO_CLIENT', (data) =>{
        
        !!data && productDetailActions.fetchFinished([data])
      });
    })
  }

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
    let { profile, messages } = this.props;
    let { countNoti } = this.state;

    let email = (profile.info) ? profile.info.email : "";
    let fullName = (profile.info) ? `${profile.info.firstname} ${profile.info.lastname}` : "";

    return (
      <nav className="navbar navbar-default navbar-static-top m-b-0">
        <div className="navbar-header">
            <ul className="nav navbar-top-links navbar-left">
                <li><Link  onClick={this.toggetClickmenu} to="#" className="open-close waves-effect waves-light visible-xs"><i className="ti-close ti-menu"></i></Link></li>
                <li className="dropdown">
                    <Link className="dropdown-toggle waves-effect waves-light" data-toggle="dropdown" to="#"> <i className="mdi mdi-gmail"></i>
                        <div className={`${countNoti > 0 ? 'notify' : ""}`}>
                        <span className="heartbit"></span> <span className="point"></span>
                        </div>
                    </Link>
                    <ul style={{width: '500px'}} className="dropdown-menu messageBankcas mailbox animated bounceInDown">
                        <li>
                            <div className="drop-title">You have {countNoti} new messages</div>
                        </li>
                        <Scrollbars  onScrollFrame ={ this.onScrollFrame } className="hiddenOverX" style={{height: '40vh'}}>
                            
                            {
                                !!messages.ordered && messages.ordered.length > 0 && 
                                  messages.ordered.map((e, i) => {
                                  let name = messages.data[e] && messages.data[e] && messages.data[e].users ? `${messages.data[e].users.firstname} ${messages.data[e].users.lastname}` : "";
                                  let link = messages.data[e] && messages.data[e].link ? `${messages.data[e].link}?noti=${e}` : ''; 
                                  let txt = (
                                    <span className="mail-desc">
                                        <strong style={{margin: '0 5px'}}>{name}</strong> &#32;	
                                        {messages.data[e].nameAction ? messages.data[e].nameAction : ""} &#32;
                                        <strong style={{margin: '0 5px'}}>{messages.data[e].nameWork ? messages.data[e].nameWork : ""}</strong> 
                                    </span> 
                                    );
                                  return (
                                        <li key={i} className={`${!!messages.data[e].status ? "" : "active"}`}>
                                            <div className="message-center">
                                                <Link to={link}>
                                                    <div className="user-img">
                                                    <img src={users} alt="user" className="img-circle" /> 
                                                    <span className="profile-status online pull-right"></span>
                                                    </div>
                                                    <div className="mail-contnet">
                                                        {txt}
                                                        <span className="time">
                                                          {messages.data[e].time ? convertTimeMess(messages.data[e].time) : ""}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                            
                            
                        </Scrollbars>
                        
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
  let { profile, session }  = state;
  let { messages }          = state.categories;
  return { profile, session, messages };
};

let mapDispatchToProps = (dispatch) => {
  return {
    sessionActions        : bindActionCreators(sessionActions, dispatch),
    profileActions        : bindActionCreators(profileActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
    messageActions        : bindActionCreators(messageActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);