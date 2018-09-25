import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Breadcrumb extends React.Component {
  render() {
    let { breadcrumb } = this.props;
    return (
      <div className="row bg-title">
      
        <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
            <h4 className="page-title">{ (breadcrumb.page_name) ? breadcrumb.page_name : "" }</h4>
        </div>

        <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12"> 
            <ol className="breadcrumb">
                <li><Link to="/">Dashboard</Link></li>
                { (breadcrumb.breadcrumb && breadcrumb.breadcrumb.length > 0) ?
                 (breadcrumb.breadcrumb.map( (e, i) => {
                  let liClass = ( e.liClass ) ? e.liClass : "";
                  let url     = ( e.url ) ? (<Link to={e.url} > {(e.name ? e.name: "")} </Link>) : (e.name ? e.name: "");
                
                  return (<li key={i} className={ liClass }>
                            { url }
                          </li>);
                }) ) : null}
                
            </ol>
        </div>
    </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { breadcrumb } = state;
  return { breadcrumb };
};

export default connect(mapStateToProps, null)(Breadcrumb);