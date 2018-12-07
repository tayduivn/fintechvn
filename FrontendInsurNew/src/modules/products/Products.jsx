import React, { Component,  } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { RangeSilder, Select, withNotification } from 'components';
import { validate } from 'utils/validate';
import { actions as productNameActions } from 'modules/categories/productName';
import { actions as carTypeActions } from 'modules/categories/carType';

import ListCarType from './ListCarType';

class Products extends Component {
  _productnameSelector = null;

  constructor(p){
    super(p);
    this.state = {
      newCarType  : false,
      addSeats    : false,
      newYear     : false
    }
  }

  componentDidMount(){
    let { profile, productNameActions, carTypeActions } = this.props;

    let where  = { removed: 0, insur_id: profile.info.agency.id};

    productNameActions.fetchAll(null, 0, 0, where);
    carTypeActions.fetchAll(null, 0, 0, where);

  }
  //==========================================
  
  productNameSubmit = () => {
    let { profile, productNameActions, notification } = this.props;

    if(!!this._productnameSelector && validate(this._productnameSelector, 'str:3:200')){
      let name = !!this._productnameSelector ? this._productnameSelector.value : "";
      let data = { name, insur_id: profile.info.agency.id };
      
      productNameActions.create(data)
        .then(r => {
          if(!!r.error) return Promise.reject(r.error);
          notification.s('Message', 'Create item success')
        })
        .catch(e => notification.s('Message', e.message || e.messagse))
        .finally(() => this._productnameSelector.value = "");

    }
  }
  
  //==========================================

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
              <Link to="#" onClick={ this.changeFormCarType } className="btn btn-default btn-flat">
                <i className="fa fa-close"/>
              </Link>
            </div>
            
          </div>
        </form>
      )
    return (
      <Link onClick={ this.changeFormCarType } className="btn btn-custom btn-block waves-effect waves-light" to="#">
        <i className="fa fa-plus"></i>
        <span> New Car Type</span>
      </Link>
    );
    
  }

  handelFormSeats = () => {
    if(this.state.addSeats)
      return (
        <Link onClick={ this.changeFormSeats } className="btn btn-success btn-block waves-effect waves-light" to="#">
          <i className="fa fa-check"></i>
          <span> Done</span>
        </Link>
      )

    return (
      <Link onClick={ this.changeFormSeats } className="btn btn-custom btn-block waves-effect waves-light" to="#">
        <i className="fa fa-plus"></i>
        <span> Seats</span>
      </Link>
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
        <Link className="list-group-item " to="#">
          <span>1113333</span>
          <span className="removeSeats pull-right"><i className="fa fa-close" /></span>
        </Link>
        <Link className="list-group-item active" to="#">
          <span>1113333</span>
          <span className="removeSeats pull-right"><i className="fa fa-close" /></span>
        </Link>
        <Link className="list-group-item " to="#">
          <span>1113333</span>
          <span className="removeSeats pull-right"><i className="fa fa-close" /></span>
        </Link>
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
              <Link to="#" onClick={ this.changeFormYear } className="btn btn-default btn-flat">
                <i className="fa fa-close"/>
              </Link>
            </div>
            
          </div>
        </form>
      )
    return (
      <Link onClick={ this.changeFormYear } className="btn btn-custom btn-block waves-effect waves-light" to="#">
        <i className="fa fa-plus"></i>
        <span> New Car Type</span>
      </Link>
    );
  }

  render() {
    let { productName, carType } = this.props;
    let productNameOP = [{text: '-- Select product', value: null}];

    productName.ordered.forEach(e => {
      let item = productName.data[e];
      if(!!item && !item.removed) productNameOP.push({text: item.name, value: e})
    })

    return (
      <React.Fragment>
        
        <div>
          <div className="row">
            <div className="col-lg-6 col-sm-6 col-xs-6">
              <div className="white-box">
                <Select 
                  options = {productNameOP} />
                
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 col-xs-6">
              <div className="white-box">
                <form>
                  <div className="input-group ">
                    <input ref={ e => this._productnameSelector = e} placeholder="Enter name here to create new product" className="form-control" />
                    <div className="input-group-addon p-0 no-bd">
                      <button 
                        type="button"
                        onClick={ this.productNameSubmit }
                        className="btn btn-success btn-flat">Save</button>
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

                    <ListCarType carType = { carType } />

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
                      <Link className="list-group-item " to="#">
                        1113333
                      </Link>
                      <Link className="list-group-item " to="#">
                        1113333
                      </Link>
                      <Link className="list-group-item active" to="#">
                        1113333
                      </Link>
                    </div>

                  </div>

                  {/* Column 04 */}
                  <div className="col-lg-3 col-sm-3 col-xs-3">
                    <h3 className="box-title">Fee</h3>
                    <div className="form-group m-b-15">
                      <input placeholder="Enter name..." className="form-control" />
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
  let { categories, profile } = state;
  let { productName, carType } = categories;

  return { productName, profile, carType };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productNameActions   : bindActionCreators(productNameActions, dispatch),
    carTypeActions       : bindActionCreators(carTypeActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Products));