import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import $ from 'jquery';

class Menu extends Component {

  toggetClickmenu = () =>{
    $('body').toggleClass('show-sidebar');
  }

  render() {

    return (
      <nav className="navbar navbar-default navbar-static-top m-b-0">
        <div className="navbar-header">  
            <ul className="nav navbar-top-links navbar-left">
                <li>
                    <Link onClick={this.toggetClickmenu} to="#" className="open-close waves-effect waves-light visible-xs">
                        <i className="ti-close ti-menu"></i>
                    </Link>
                </li>
            </ul>
        
        </div>
    </nav>
    );
  }
}



export default Menu;