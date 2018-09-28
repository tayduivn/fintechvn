import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';

class DashBoard extends Component {

  componentDidMount(){
    let { breadcrumbActions } = this.props;

    breadcrumbActions.set({
      page_name: 'Dashboard'
    });
  }

  render() {
    return (
      <div>
        {/* <div className="row">
          <div className="col-lg-3 col-sm-6 col-xs-12">
            <div className="white-box">
              <h3 className="box-title">Total code</h3>
              <ul className="list-inline two-part">
                <li><i className="fa fa-barcode text-info"></i></li>
                <li className="text-right"><span className="counter">10</span></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6 col-xs-12">
            <div className="white-box">
              <h3 className="box-title">Checked code</h3>
              <ul className="list-inline two-part">
                <li><i className="fa fa-send-o text-purple"></i></li>
                <li className="text-right"><span className="counter">10</span></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6 col-xs-12">
            <div className="white-box">
              <h3 className="box-title">Success code</h3>
              <ul className="list-inline two-part">
                <li><i className="fa fa-check text-success"></i></li>
                <li className="text-right"><span className="">10</span></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6 col-xs-12">
            <div className="white-box">
              <h3 className="box-title">Failure code</h3>
              <ul className="list-inline two-part">
                <li><i className="fa fa-frown-o text-danger"></i></li>
                <li className="text-right"><span className="">10</span></li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

let mapStateToProps = (state) => {

  return {  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);