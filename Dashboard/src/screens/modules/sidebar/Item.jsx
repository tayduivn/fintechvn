import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Item extends Component {

  conformUrl = (url) => {
    let { pathname } = this.props.location;
    
    if(url === pathname) return true
    return false;
  }

  render() {
    let { data, profile } = this.props;
    

    return (
      <li className={'subMenu'}>
        <Link className={(this.conformUrl((data.link) ? data.link : '#')) ? 'active' : '#'} to={(data.link) ? data.link : '#'} >
          <i className={`${(data.icon) ? data.icon : ''} fa-fw`}></i>
          <span className="hide-menu">{(data.caption) ? data.caption : ''}
          {(data.children) ? (<span className="fa arrow"></span>) : null}
          </span>
        </Link>
        <ul  className={`nav nav-second-level collapse`} aria-expanded="false" >
        {
          (data.children) 
          ? ( 
            data.children.map( (e, i) => {
              if(!!e.admin && !!profile.info && e.admin !== profile.info.account_type) return null;

              let active = this.conformUrl((e.link) ? e.link : '') ? 'active' : '';
              return (
                <li key={i} className={active}>
                  <Link className={active} to={(e.link) ? e.link : ''}>
                    <i className={`${(e.icon) ? e.icon : ''} fa-fw`}></i>
                    <span className="hide-menu">{(e.caption) ? e.caption : ''} </span>
                  </Link>
                </li>
             )
            })
          )
          : null
        }
         </ul>
    </li>
    );
  }
}

export default Item;