import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import { Loading } from 'components';
import Form from './Form';
import Right from './Right';

import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { withNotification } from 'components';
import { isFnStatic, isEmpty } from 'utils/functions';
import { actions as discountActions } from 'modules/setting/discount';

class Motor extends Component {
  _discountCheckBox = null;

  constructor(props){
    super(props);
    this.state = {
      btnEnd    : false,
      endClick  : false,
      stepBegin : true,
      listInfo  : {
        _getPriceCar: {},
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

  setStateLocal = (e) => {
    let { key, value } = e;
    !!key && undefined !== value && this.state[key] !== value && this.setState({
      [key] : value
    })
  }

  endClickProduct = () => this.setState({endClick: true, nextchange: Date.now()});

  setStatePrice = (e) => {
    let { key, value } = e;
    if(!!key && undefined !== value && this.state.value !== value) 
      this.setState({
        listInfo: {
          ...this.state.listInfo,
          [key] : value
        }
      })
  }

  formSubmit = (data) => {
    let { profile, product, productDetailActions } = this.props;
    let { listInfo, sumPrice, price, addressCustomer, discount, priceVAT, sumPriceVAT } = this.state;
    let { id } = product.data.motor;
    let { options } = listInfo._getRuleExtends

    let detail = {
      ...data,
      price,
      discount,
      listInfo,
      priceVAT,
      sumPrice,
      sumPriceVAT,
      ruleExtends: { ...options }
    };

    if(!!addressCustomer) detail.addressCustomer = addressCustomer;

    let dt = {
      detail,
      created_by  : profile.info.id,
      product_id  : id,
      insur_id   : profile.info.agency.insur_id,
      bankcas_id  : profile.info.agency.bankcas_id,
      agency_id   : profile.info.agency.id,
      create_at   : Date.now(),
      price       : sumPriceVAT
    }

    productDetailActions.create(dt)
      .then(res => { 
        if(!!res.error) return Promise.reject(res.error);
        this.handleSuccess(res.data);
      }, e => Promise.reject(e))
      .catch(e => this.handleError(e))

  }

  handleError = (error) => this.props.notification.e('Error', error.messagse);

  handleSuccess = (data) => this.props.history.push(`/product/motor/${data.id}`);

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
          if(!!_getRuleExtends.options[key] && !isEmpty(_getRuleExtends.options[key])){
            let { fee } = _getRuleExtends.options[key];
            fee = !!fee ? fee : 0;

            priceMore += fee;
          }
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

  discountCheckBox = ({select, discount}) => {
    let fl = !!select ? select.checked : false;
    if(!fl)  discount = 0;
    this.setState({discount});
  }

  componentDidMount(){
    let { product, profile, productActions, productDetail, productDetailActions, discountActions } = this.props;

    let where  = { type: "discount", insur_id: profile.info.agency.insur_id};

    discountActions.fetchAll(null, 0, 0, where)
      .then(r => {
        let discount : 0;
        if(!!r && !!r.house) discount = r.house;
        this.setState({discount});
      });

    if(productDetail.ordered.length === 0) productDetailActions.fetchAll({
      include: [
        {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
        {relation: "product", scope: { fields: { name: true, type: true }}},
      ],
      order: "id DESC"
    }, 0, 0, {agency_id: profile.info.agency.id});

    if(!product.data.motor) productActions.fetchProduct('motor')
      .then(res => { 
        // if(!!res && !!res.data) isFnStatic('onLoad', {component: this});
      });
      
  }

  _ftHandlerEvent = (DOMElement, eventName, handlerFunction) => {
    if (!!DOMElement && handlerFunction instanceof Function){
      if ('addEventListener' in DOMElement) DOMElement.addEventListener(eventName, handlerFunction);
      else if ('attachEvent' in DOMElement) DOMElement.attachEvent('on' + eventName, handlerFunction);
      else DOMElement['on' + eventName] = handlerFunction;
    }
  }

  callbackFunction = (el, name, cb) =>{ 
    this._ftHandlerEvent(el, name, () => { 
      isFnStatic(cb, {component: this, el}, (obj, action) => {
        isFnStatic(action)
      })
    })
  }

  render() {
    
    let { product, productDetail, t, discount } = this.props;
    
    if(product.isWorking || productDetail.isWorking) return <Loading />

    let { btnEnd, endClick, listInfo, price, sumPrice, disPrice, priceVAT, sumPriceVAT } = this.state;

    let newListInfo = [];
    for(let key in listInfo){
      let newlist = {};
      if(!isEmpty(listInfo[key])) newlist = listInfo[key];

      newListInfo.push(newlist);
    }

    let tabs      = [];
    let contents  = [];
    
    if(!!product.data.motor){
      for(let step in product.data.motor.steps){
        let { name, icon, lang, controls } = product.data.motor.steps[step];
        tabs.push({name, icon, lang});
        contents.push({controls, step});
      }
    }
    
    contents = contents.filter(e => e.step !== "tabFile");
    tabs.splice(contents.length, 1);

    return (
      <div className="row">
        <div className="col-sm-9">
          <div className="white-box">
            <h3 className="box-title m-b-0">{t('product:motor_createRequest')} </h3>
            <p className="text-muted m-b-10 font-13">{t('product:motor_descCreateRes')}</p>

            <Form
              contents    = { contents }
              t           = { t }
              endClick    = { endClick }
              formSubmit  = { this.formSubmit }
              _ftHandlerEvent = { this._ftHandlerEvent }
              callbackFunction = { this.callbackFunction }
              stepBegin     = { stepBegin => this.setState({stepBegin}) }
              onClickEnd    = { btnEnd => this.setState({btnEnd, nextchange: Math.random()})}
              setStatePrice = { this.setStatePrice }
              setStateLocal = { this.setStateLocal }
              stateLocal    = { this.state }
              tabs          = { tabs } />

          </div>
        </div>
        <Right
          listInfo    = { listInfo }
          price       = { price }
          sumPrice    = { sumPrice }
          btnEnd      = { btnEnd }
          disPrice    = { disPrice }
          priceVAT          = { priceVAT }
          sumPriceVAT       = { sumPriceVAT }
          discountCheckBox  = { this.discountCheckBox }
          discount          = { !!discount.item.house ? discount.item.house : 0 }
          endClickProduct   = { this.endClickProduct }
          t                 = { t } />
      </div>
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

export default withNotification(translate(['product'])(connect(mapStateToProps, mapDispatchToProps)(Motor)));