import React, { Component,  } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Modal, RangeSilder } from 'components';
import { ConetntCarType } from './contentModal';

import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';

class DashBoard extends Component {

  constructor(p){
    super(p);
    this.state = {
      newCarType  : false,
      addSeats    : false,
      newYear     : false
    }
  }

  setStateLocal = (key, value) => {

  }

  changeFormCarType = () => this.setState({ ...this.state, newCarType: !this.state.newCarType});

  changeFormSeats = () => this.setState({ ...this.state, addSeats: !this.state.addSeats});

  changeFormYear = () => this.setState({ ...this.state, newYear: !this.state.newYear});

  handelFormCarType = () => {
    if(this.state.newCarType)
      return (
        <form>
          <div className="input-group ">
            <input placeholder="Enter name..." className="form-control" />
            <div className="input-group-addon p-0 no-bd">
              <button className="btn btn-success btn-flat">
                <i className="fa fa-check"/>
              </button>
            </div>
            <div className="input-group-addon p-0 no-bd">
              <a href="javascript:;" onClick={ this.changeFormCarType } className="btn btn-default btn-flat">
                <i className="fa fa-close"/>
              </a>
            </div>
            
          </div>
        </form>
      )
    return (
      <a onClick={ this.changeFormCarType } className="btn btn-custom btn-block waves-effect waves-light" href="javascript:;">
        <i className="fa fa-plus"></i>
        <span> New Car Type</span>
      </a>
    );
    
  }

  handelFormSeats = () => {
    if(this.state.addSeats)
      return (
        <a onClick={ this.changeFormSeats } className="btn btn-success btn-block waves-effect waves-light" href="javascript:;">
          <i className="fa fa-check"></i>
          <span> Done</span>
        </a>
      )

    return (
      <a onClick={ this.changeFormSeats } className="btn btn-custom btn-block waves-effect waves-light" href="javascript:;">
        <i className="fa fa-plus"></i>
        <span> Seats</span>
      </a>
    );
  }

  handelContentSeats = () => {
    if(this.state.addSeats)
      return (
        <div className="input-group ">
          <div className="input-group-addon p-0 no-bd bg-white">
            <div className="checkbox checkbox-info pull-left">
                <input id="ascasc" type="checkbox" />
                <label htmlFor="ascasc">ascascascascasc</label>
            </div>
          </div>
        </div>
      )

    return (
      <div className="list-group seatsList mail-list m-t-20">
        <a className="list-group-item " href="/project/view/5bc8ac30f438e31b30bb8ad0">
          <span>1113333</span>
          <span className="removeSeats pull-right"><i className="fa fa-close" /></span>
        </a>
        <a className="list-group-item active" href="/project/view/5bc98d1b870f4f1338c25ff8">
          <span>1113333</span>
          <span className="removeSeats pull-right"><i className="fa fa-close" /></span>
        </a>
        <a className="list-group-item " href="/project/view/5bcfecc1adc3cd19e43ad439">
          <span>1113333</span>
          <span className="removeSeats pull-right"><i className="fa fa-close" /></span>
        </a>
      </div>
    );
  }

  handelFormYear = () => {
    if(this.state.newYear)
      return (
        <form>
          <div className="input-group ">
            <div className="col-xs-12" style={{marginTop: '8px'}}>
              <RangeSilder 
                maxValue={100}
                minValue={10}
                value={20}
                onChange= { maxValue => this.setState({maxValue}) }/>
            </div>
            <div className="input-group-addon p-0 no-bd">
              <button className="btn btn-success btn-flat">
                <i className="fa fa-check"/>
              </button>
            </div>
            <div className="input-group-addon p-0 no-bd">
              <a href="javascript:;" onClick={ this.changeFormYear } className="btn btn-default btn-flat">
                <i className="fa fa-close"/>
              </a>
            </div>
            
          </div>
        </form>
      )
    return (
      <a onClick={ this.changeFormYear } className="btn btn-custom btn-block waves-effect waves-light" href="javascript:;">
        <i className="fa fa-plus"></i>
        <span> New Car Type</span>
      </a>
    );
  }

  render() {

    let { newCarType } = this.state;
    
    return (
      <React.Fragment>
        
        <div>
          <div className="row">
            <div className="col-lg-6 col-sm-6 col-xs-6">
              <div className="white-box">
                <select className="form-control">
                  <option>--Select product</option>
                  <option>Nhà tư nhân</option>
                  <option>Xe ô tô</option>
                  <option>Con người</option>
                </select>
                
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 col-xs-6">
              <div className="white-box">
                <form>
                  <div className="input-group ">
                    <input placeholder="Enter name here to create new product" className="form-control" />
                    <div className="input-group-addon p-0 no-bd">
                      <button className="btn btn-success btn-flat">Save</button>
                    </div>
                    
                  </div>
                </form>
                
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 col-sm-12 col-xs-12">
              <div className="white-box">

                <div className="row">
                  {/* Column 01 */}
                  <div className="col-lg-3 col-sm-3 col-xs-3">
                    

                    { this.handelFormCarType() }

                    <div className="list-group mail-list m-t-20">
                      <a className="list-group-item active" href="/project/view/5bc8ac30f438e31b30bb8ad0">1113333</a>
                      <a className="list-group-item " href="/project/view/5bc98d1b870f4f1338c25ff8">ascascascasc</a>
                      <a className="list-group-item " href="/project/view/5bcfecc1adc3cd19e43ad439">châu minh thiện</a>
                    </div>

                  </div>

                  {/* Column 02 */}
                  <div className="col-lg-3 col-sm-3 col-xs-3">

                    { this.handelFormSeats() }

                    { this.handelContentSeats() }

                  </div>

                  {/* Column 03 */}
                  <div className="col-lg-3 col-sm-3 col-xs-3">
                    { this.handelFormYear() }

                    <div className="list-group mail-list m-t-20">
                      <a className="list-group-item " href="/project/view/5bc8ac30f438e31b30bb8ad0">
                        1113333
                      </a>
                      <a className="list-group-item " href="/project/view/5bc98d1b870f4f1338c25ff8">
                        1113333
                      </a>
                      <a className="list-group-item active" href="/project/view/5bcfecc1adc3cd19e43ad439">
                        1113333
                      </a>
                    </div>

                  </div>

                  {/* Column 04 */}
                  <div className="col-lg-3 col-sm-3 col-xs-3">
                    <h3 className="box-title">Fee</h3>
                    <div className="form-group m-b-15">
                      <input value="111" placeholder="Enter name..." className="form-control" />
                    </div>
                    <div className="form-group">
                      <button className="btn btn-success btn-flat">Save</button>
                    </div>
                  </div>

                </div>
                
              </div>
            </div>
          </div>

        </div>
      </React.Fragment>
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