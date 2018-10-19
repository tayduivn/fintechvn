import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Form from './Form';

import { actions as yearsActions } from 'modules/categories/years';
import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { Loading, withNotification } from 'components';
import { isEmpty } from 'utils/functions';
import { formatPrice, convertDMY } from 'utils/format';
import { Error404 } from 'modules';

class View extends Component {
  _inputText = null;

  constructor(props){ 
    super(props);
    this.state = {
      endClick  : false,
      stepBegin : true,
      didMount  : false,
      listInfo  : {
        _getPriceCar: { },
        _getYearCar: {},
        _getCareType: {},
        _getSeatsPayload: {},
        _getRuleExtends: {
          name: "Lựa chọn bổ sung", options: {}
        },
      },
      price     : 0,
      sumPrice  : 0,
      nextchange: 0
    }
  }

  componentWillMount(){
    let { match, product, profile, years, productActions, yearsActions, productDetail,
      productDetailActions } = this.props;
    
    let { id }        = match.params;
    let dataRequest   = productDetail.data[id];

    if(years.ordered.length === 0) yearsActions.fetchAll({}, 0, 0, {insur_id: profile.info.agency.insur_id});

    if(!product.data.motor) productActions.fetchProduct('motor');

    if(!dataRequest){
      productDetailActions.fetchAll(
        {
          include: [
            {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
            {relation: "product", scope: { fields: { name: true, type: true }}},
          ],
          order: "id DESC"
        }, 0, 0, {agency_id: profile.info.agency.id}
      )
      .then(res => {
        let { match } = this.props;
        let { id }        = match.params;
        if(!!res){
          let dataRequest   = res.filter(e => e.id === id);
          dataRequest = !!dataRequest ? dataRequest[0] : null;
          
          if(!!dataRequest) this.setInfoProduct(dataRequest)
        }
      });
    } else this.setInfoProduct(dataRequest)
  }

  setInfoProduct = (dataRequest) => {
    let state = {
      price : dataRequest.detail && dataRequest.detail.price ? dataRequest.detail.price : 0,
      sumPrice: dataRequest.price ? dataRequest.price : 0,
      listInfo : !!dataRequest.detail.listInfo ? { ...dataRequest.detail.listInfo} : this.state.listInfo
    };
    
    this.setState({...state});
  }

  render() { 
    
    let { product, match, productDetail, years } = this.props;
    let { id }        = match.params;
    
    if( product.isWorking || productDetail.isWorking || years.isWorking) return <Loading />

    let dataRequest = productDetail.data[id];
    if(!product.data.motor || !dataRequest || dataRequest.status === 0) return (<Error404 />);
    
    let { listInfo, price, sumPrice } = this.state;

    let newListInfo = [];
    for(let key in listInfo){
      let newlist = {};
      if(!isEmpty(listInfo[key])) newlist = listInfo[key];
      newListInfo.push(newlist);
    }

    let tabs      = [];
    let contents  = [];

    if(!!product.data.motor){
      let tabFile = {
        "name": "File đính kèm",
        'controls': [
            [{
              "label" : "File đính kèm",
              "question" : "File đính kèm là gì",
              "tag" : "inputFile>id:file",
              "required" : false,
              "col": 12,
              "id" : "file",
              "message" : "Không được trống"
            }]
          ]
        }

      product.data.motor.steps['tabFile'] = tabFile;

      for(let step in product.data.motor.steps){
        let { name, icon, controls } = product.data.motor.steps[step];
        tabs.push({name, icon});
        if(!!controls && !isEmpty(controls)){
          contents.push({controls, step});
        }
        
      }
    }

    return (
      <Fragment>
        <div className="row">
          <div className="col-sm-9">
            <div className="white-box">
              <h3 className="box-title m-b-0">Tạo yêu cầu</h3>
              <p className="text-muted m-b-10 font-13">Vui lòng thực hiện đầy đủ các bước.</p>

              <Form
                contents    = { contents }
                dataRequest = { dataRequest }
                view        = { true }
                tabs        = { tabs } />

            </div>
          </div>
          <div className="col-sm-3 p-l-0 productLeft">
            {
              dataRequest.status === 3
              ? (
                <div className="white-box">
                  <div className="col-md-6 text-center bd-r">
                    <label className="strong">Ngày bắt đầu</label>
                    <p className="form-control-static">
                      { (dataRequest.startDay) ? convertDMY(dataRequest.startDay, '.') : ''}
                    </p>
                  </div>
                  <div className="col-md-6 text-center">
                    <label className="strong">Ngày bắt đầu</label>
                    <p className="form-control-static">
                      { (dataRequest.endDay) ? convertDMY(dataRequest.endDay, '.') : ''}
                    </p>
                  </div>
                  <div className="col-md-12 text-center m-t-5" style={{background: "hsla(0,0%,78%,.2)", padding: '10px'}}>
                    <h3 >
                      <small style={{fontSize: '18px', fontWeight: '700'}}>Hạn thanh toán</small>
                    </h3>
                    <p className="form-control-static">
                      { (dataRequest.payDay) ? convertDMY(dataRequest.payDay, '.') : ''}
                    </p>
                  </div>
                  <div className="clear"></div>
                </div>
              )
              : null
            }

            {
              dataRequest.status === 2
              ? (
                <div className="white-box bg-danger">
                  <div className="col-md-12 m-t-5" style={{background: "hsla(0,0%,78%,.2)", padding: '10px'}}>
                    <h3 >
                      <small className="text-white" style={{fontSize: '18px', fontWeight: '700'}}>Lời nhắn:</small>
                      <p className="text-white" >{dataRequest.messagse ? dataRequest.messagse : ""}</p>
                    </h3>
                    <p className="form-control-static">
                      { (dataRequest.payDay) ? convertDMY(dataRequest.payDay, '.') : ''}
                    </p>
                  </div>
                  <div className="clear"></div>
                </div>
              )
              : null
            }
          
            <div className="white-box">
              <h3 className="box-title m-b-0">Thông tin sản phẩm</h3>
              <ul className="wallet-list listInfoProduct">
                {
                  newListInfo.map((e, i) => {
                    if(isEmpty(e) || e.options) return null;
                    return (
                      <li key={i}>
                        <span className="pull-left"> <strong>{e.name ? e.name : ""}</strong> </span>
                        <span className="pull-right">{ undefined !== e.text ? e.text : ""}</span>
                        <div className="clear"></div>
                      </li>
                    )
                  })
                }

                <li>
                  <span className="pull-left text-info"> <strong>Thành tiền</strong> </span>
                  <span className="pull-right text-danger"><strong>{formatPrice(price, 'VNĐ', 1)}</strong></span>
                  <div className="clear"></div>
                </li>
              </ul>
              <h4 style={{fontSize: '13px'}} className="box-title m-b-0">Lựa chọn bổ sung</h4>
              <ul className="wallet-list listInfoProduct more">
                  {
                    (!!listInfo._getRuleExtends.options && !isEmpty(listInfo._getRuleExtends.options))
                    ? (
                      <ul className="wallet-list listInfoProduct more">
                        {
                          Object.keys(listInfo._getRuleExtends.options).map((el, y) => {
                            return (
                              <li className="p-l-30" key={y}>
                                <span className="pull-left"> 
                                <strong>
                                  {listInfo._getRuleExtends.options[el].name ? listInfo._getRuleExtends.options[el].name : ""}
                                </strong> 
                                </span>
                                <span className="pull-right">
                                  { undefined !== listInfo._getRuleExtends.options[el].ratio ? listInfo._getRuleExtends.options[el].ratio : "0"}%
                                </span>
                                <div className="clear"></div>
                              </li>
                          )})
                        }
                      </ul>
                    )
                    : null
                  }

                <li>
                  <span className="pull-left text-info"> <strong>Tổng tiền</strong> </span>
                  <span className="pull-right text-danger"><strong>{formatPrice(sumPrice, 'VNĐ', 1)}</strong></span>
                  <div className="clear"></div>
                </li>
              </ul>
              
              <div className="clear"></div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  let { product, profile, productDetail } = state;
  let { years } = state.categories;
  return { product, years, profile, productDetail };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productActions        : bindActionCreators(productActions, dispatch),
    yearsActions          : bindActionCreators(yearsActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(View));