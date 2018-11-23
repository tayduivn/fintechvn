import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import Form from './Form';

import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { Loading, withNotification } from 'components';
import { isEmpty } from 'utils/functions';
import { formatPrice, convertDMY } from 'utils/format';
import { Error404 } from 'modules';
import { actions as discountActions } from 'modules/setting/discount';

class View extends Component {
  _inputText = null;
  _discountCheckBox = null;

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
      price       : 0,
      sumPrice    : 0,
      sumPriceVAT : 0,
      nextchange  : 0,
      discount    : 0,
      disPrice    : 0,
      priceVAT    : 0
    }
  }

  componentWillMount(){
    let { match, product, profile, productActions, productDetail,
      productDetailActions, discountActions } = this.props;
    
    let where  = { type: "discount", insur_id: profile.info.agency.insur_id};

    discountActions.fetchAll(null, 0, 0, where)
      .then(r => {
        let discount : 0;
        if(!!r && !!r.motor) discount = r.motor;
        this.setState({discount});
      });

    let { id }        = match.params;
    let dataRequest   = productDetail.data[id];

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

  componentDidUpdate(nextProps, nextState){
    let { price, listInfo, sumPrice, discount } = this.state;

    let { _getPriceCar, _getRuleExtends, _getSeatsPayload } = listInfo;

    if( !isEmpty(_getPriceCar) && !isEmpty(_getSeatsPayload)){
      let priceSum  = +_getPriceCar.value;
      let ratioSP   = _getSeatsPayload.ratio;
      let priceMore = 0;

      price = priceSum * ratioSP / 100;
      sumPrice = price;
      
      if(!isEmpty(_getRuleExtends.options)){
        for(let key in _getRuleExtends.options){
          let { type, ratio } = _getRuleExtends.options[key];
          priceMore += (!!type ? (price * ratio / 100) : (priceSum * ratio / 100) );
        }
      }

      sumPrice += priceMore;

      let disPrice = 0;
      discount = parseInt(discount, 10);
      if(!!discount) disPrice = sumPrice * (discount*1.0/100);
      sumPrice -= disPrice;

      let priceVAT = sumPrice*0.1;

      let sumPriceVAT = sumPrice + priceVAT;

      if(this.state.price !== price || this.state.sumPrice !== sumPrice || 
        this.state.disPrice !== disPrice || this.state.priceVAT !== priceVAT || this.state.sumPriceVAT !== sumPriceVAT)
        this.setState({price, sumPrice, disPrice, priceVAT, sumPriceVAT});
    }
  }

  setInfoProduct = (dataRequest) => {
    let state = {
      price           : dataRequest.detail && dataRequest.detail.price ? dataRequest.detail.price : 0,
      sumPrice        : dataRequest.price ? dataRequest.price : 0,
      listInfo        : !!dataRequest.detail.listInfo ? { ...dataRequest.detail.listInfo} : this.state.listInfo,
      addressCustomer : dataRequest.detail && dataRequest.detail.addressCustomer ? dataRequest.detail.addressCustomer : {},
      discount        : dataRequest.detail && dataRequest.detail.discount ? dataRequest.detail.discount : 0,
      sumPriceVAT     : dataRequest.detail && dataRequest.detail.sumPriceVAT ? dataRequest.detail.sumPriceVAT : 0,
      priceVAT        : dataRequest.detail && dataRequest.detail.priceVAT ? dataRequest.detail.priceVAT : 0,
    };
    
    this.setState({...state});
  }

  render() { 
    
    let { product, match, productDetail, t, discount } = this.props;
    let { id }        = match.params;
    
    if( product.isWorking || productDetail.isWorking) return <Loading />

    let dataRequest = productDetail.data[id];
    if(!product.data.motor || !dataRequest || dataRequest.status === 0) return (<Error404 />);
    
    let { listInfo, price, sumPrice, disPrice, priceVAT, sumPriceVAT } = this.state;

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
        "lang" : "motor_tab_file",
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
        let { name, icon, lang, controls } = product.data.motor.steps[step];
        tabs.push({name, icon, lang});
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
              <h3 className="box-title m-b-0">{t('product:motor_createRequest')}</h3>
              <p className="text-muted m-b-10 font-13">{t('product:motor_descCreateRes')}</p>

              <Form
                contents    = { contents }
                dataRequest = { dataRequest }
                view        = { true }
                t           = { t }
                tabs        = { tabs } />

            </div>
          </div>
          <div className="col-sm-3 p-l-0 productLeft">
            {
              dataRequest.status === 3
              ? (
                <div className="white-box">
                  <div className="col-md-6 text-center bd-r">
                    <label className="strong">{t('product:motor_beginDay')}</label>
                    <p className="form-control-static">
                      { (dataRequest.startDay) ? convertDMY(dataRequest.startDay, '.') : ''}
                    </p>
                  </div>
                  <div className="col-md-6 text-center">
                    <label className="strong">{t('product:motor_endDay')}</label>
                    <p className="form-control-static">
                      { (dataRequest.endDay) ? convertDMY(dataRequest.endDay, '.') : ''}
                    </p>
                  </div>
                  <div className="col-md-12 text-center m-t-5" style={{background: "hsla(0,0%,78%,.2)", padding: '10px'}}>
                    <h3 >
                      <small style={{fontSize: '18px', fontWeight: '700'}}>{t('product:motor_payDay')}</small>
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
                      <small className="text-white" style={{fontSize: '18px', fontWeight: '700'}}>{t('product:motor_mess')}:</small>
                      <p className="text-white" >{dataRequest.messagse ? dataRequest.messagse : ""}</p>
                    </h3>
                  </div>
                  <div className="clear"></div>
                </div>
              )
              : null
            }
          
            <div className="white-box">
              <h3 className="box-title m-b-0">{t('product:motor_productDetail')}</h3>
              <ul className="wallet-list listInfoProduct">
                {
                  newListInfo.map((e, i) => {
                    if(isEmpty(e) || e.options) return null;
                    return (
                      <li key={i}>
                        <span className="pull-left"> <strong>{e.name ? (e.lang ? t(`product:${e.lang}`) : e.name) : ""}</strong> </span>
                        <span className="pull-right">{ undefined !== e.text ? e.text : ""}</span>
                        <div className="clear"></div>
                      </li>
                    )
                  })
                }

                <li>
                  <span className="pull-left text-info"> <strong>{t('product:motor_right_fee')}</strong> </span>
                  <span className="pull-right text-danger"><strong>{formatPrice(price, 'VNĐ', 1)}</strong></span>
                  <div className="clear"></div>
                </li>
              </ul>
              <h4 style={{fontSize: '13px'}} className="box-title m-b-0">{t('product:motor_addMore')}</h4>
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
              </ul>

              {
                !!disPrice && (
                  <ul className="wallet-list listInfoProduct more">
                    <li>
                      <span className="pull-left text-info"> <strong>{t('product:discount')}</strong> </span>
                      <span className="pull-right text-danger"><strong>-{formatPrice(disPrice, 'VNĐ', 1)}</strong></span>
                      <div className="clear"></div>
                    </li>
                  </ul>
                )
              }

              <ul className="wallet-list listInfoProduct more">
                <li>
                  <span className="pull-left text-info"> <strong>{t('product:motor_right_sumMoney')}</strong> </span>
                  <span className="pull-right text-danger"><strong>{formatPrice(sumPrice, 'VNĐ', 1)}</strong></span>
                  <div className="clear"></div>
                </li>
              </ul>

              {
                !!priceVAT && (
                  <ul className="wallet-list listInfoProduct more">
                    <li>
                      <span className="pull-left text-info"> <strong>{t('product:motor_right_vat')}</strong> </span>
                      <span className="pull-right text-danger"><strong>{formatPrice(priceVAT, 'VNĐ', 1)}</strong></span>
                      <div className="clear"></div>
                    </li>
                  </ul>
                )
              }

              {
                !!sumPriceVAT && (
                  <ul className="wallet-list listInfoProduct more">
                    <li>
                      <span className="pull-left text-info"> <strong>{t('product:motor_right_money')}</strong> </span>
                      <span className="pull-right text-danger"><strong>{formatPrice(sumPriceVAT, 'VNĐ', 1)}</strong></span>
                      <div className="clear"></div>
                    </li>
                  </ul>
                )
              }

              <div className="col-md-12 p-l-0">
                <div className="checkbox checkbox-info pull-left col-md-12">
                  <input
                    defaultChecked  = { !dataRequest || (!!dataRequest && !!dataRequest.detail.discount) }
                    disabled = { true }
                    id      = { 'checkbox' }
                    ref     = { el => this._discountCheckBox = el } type="checkbox" />
                  <label htmlFor={'checkbox'} > {t('product:discount')} { !!discount.item.motor ? discount.item.motor : 0 } % </label>
                </div>
              </div>
              
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
  let { discount } = state.setting;

  return { product, profile, productDetail, discount };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productActions        : bindActionCreators(productActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
    discountActions       : bindActionCreators(discountActions, dispatch),
  };
};

export default withNotification(translate(['product'])(connect(mapStateToProps, mapDispatchToProps)(View)));