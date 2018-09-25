import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import Router from './Routes';
import Item from './Item';

import $ from 'jquery';
import './sidebar-nav.css';

class Sidebar extends Component {
  
  componentDidMount() {
    
    
		$('ul.nav-second-level li.active').parents('li.subMenu').addClass('active').find('a').first().addClass('active');

		$('#side-menu').find("li.active").has("ul").children("ul").show();
		$('#side-menu').find("li").not(".active").has("ul").children("ul").hide();
		
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
				$('#side-menu').find('li.active').not($this).removeClass('active').children("ul").hide(300);
			}
			
    });

  }
  
  render() { 
    return (
      <div className="navbar-default sidebar" role="navigation">
				{/* <div className="sidebar-nav slimscrollsidebar"> */}
				<Scrollbars style={{ height: "100vh" }}>
            <div className="sidebar-head">
                <h3>
									<span className="fa-fw open-close">
											<i className="ti-menu hidden-xs"></i>
											<i className="ti-close visible-xs"></i>
									</span>
									<span className="hide-menu">Navigation</span>
                </h3> 
            </div>
            
            <ul className="nav" id="side-menu">
							{Router.map((e, i) => (<Item location={this.props.location} key={i} data={e} />) )}
            </ul>
				{/* </div> */}
				</Scrollbars>
    </div>
    );
  }
}

export default Sidebar;