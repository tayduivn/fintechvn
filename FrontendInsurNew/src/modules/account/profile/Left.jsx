import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import users                from 'assets/Images/user.jpg';

class Left extends Component {

  render() {
    let { profile } = this.props;

    let fullName = (profile && profile.info) ? `${profile.info.firstname} ${profile.info.lastname}` : "";
    let email = (profile && profile.info) ? `${profile.info.email}` : "";
    return (
      <div className="col-md-4 col-xs-12 m-t-15">
        <div className="white-box">
          <div className="user-bg"> <img width="100%" alt="user" src={users}/>
            <div className="overlay-box">
              <div className="user-content">
                <Link to="#"><img src={users} className="thumb-lg img-circle" alt="img" /></Link>
                <h4 className="text-white">{fullName}</h4>
                <h5 className="text-white">{email}</h5> </div>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

export default Left;