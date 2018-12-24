import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import { Loading, withNotification } from 'components';
import { isEmpty } from 'utils/functions';

import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { actions as settingActions } from 'modules/setting';

import Form from './Form';
import Right from './Right';

class House extends Component {

  constructor(props){
    super(props);
    this.state = {
      btnEnd    : false,
      endClick  : false,
      listInfo  : {
        _houseValue: {},
        _getRangeYear: {},
        _getRuleExtends: {
          name: "Lựa chọn bổ sung", options: {}
        },
        _assetHouseValue: {
          name: "Phí bảo hiểm tài sản nhà", options: {}
        },
      },
      price     : 0,
      sumPrice  : 0,
      nextchange: 0,
      discount  : 0,
      disPrice  : 0
    }
  }

  discountCheckBox = ({select, discount}) => {
    let fl = !!select ? select.checked : false;
    if(!fl)  discount = 0;
    this.setState({discount});
  }

  componentDidUpdate(nextProps, nextState){
    let { price, listInfo, sumPrice, discount } = this.state;

    let { _getRuleExtends, _assetHouseValue } = listInfo;

    if( true ){
      sumPrice = price;
      let priceMore = 0;

      if(!isEmpty(_getRuleExtends.options)){
        for(let key in _getRuleExtends.options){
          let { price: pri } = _getRuleExtends.options[key];
          priceMore += parseFloat(pri);
        }
      }
      if(!isEmpty(_assetHouseValue.options)){
        for(let key in _assetHouseValue.options){
          let { price: pri } = _assetHouseValue.options[key];
          priceMore += parseFloat(pri);
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
  
  setStatePrice = (e) =>{ 
    let { key, value } = e;
    !!key && !!value && this.setState({
      listInfo: {
        ...this.state.listInfo,
        [key] : value
      }
    })
  }

  setStateLocal = (e) => {
    let { key, value } = e;
    !!key && undefined !== value && this.state[key] !== value && this.setState({
      [key] : value
    })
  }

  componentDidMount(){
    let { product, profile, productActions,
      productDetail, productDetailActions, settingActions } = this.props;
    
    let where  = { type: "discount", insur_id: profile.info.agency.insur_id};

    settingActions.fetchAll(null, 0, 0, where)
      .then(r => {
        let discount = 0;
        if(!!r && !!r.extra && !!r.extra.house) discount = r.extra.house;
        this.setState({discount});
      });

    if(productDetail.ordered.length === 0) productDetailActions.fetchAll({
      include: [
        {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
        {relation: "product", scope: { fields: { name: true, type: true }}},
      ],
      order: "id DESC"
    }, 0, 0, {agency_id: profile.info.agency.id});

    if(!product.data.house) productActions.fetchProduct('house');
      
  }

  endClickProduct = () => this.setState({endClick: true});

  formSubmit = (data) => {
    let { profile, product, productDetailActions } = this.props;
    let { listInfo, sumPrice, price, addressCustomer, discount, priceVAT, sumPriceVAT } = this.state;
    let { id } = product.data.house;
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

  handleSuccess = (data) => this.props.history.push(`/product/house/${data.id}`);
  handleError = (error) => this.props.notification.e('Error', error.messagse);
  
  render() {
    let { product, productDetail, t, setting } = this.props;
    let { btnEnd, endClick, listInfo, price, sumPrice, disPrice, priceVAT, sumPriceVAT } = this.state;

    if(product.isWorking || productDetail.isWorking || setting.isWorking) return <Loading />;
    
    let discount = !!setting && !!setting.item.discount ? setting.item.discount : null;

    let tabs      = [];
    let contents  = [];
    
    if(!!product.data.house){
      for(let step in product.data.house.steps){
        let { name, icon, lang, controls } = product.data.house.steps[step];
        tabs.push({name, icon, lang});
        contents.push({controls, step});
      }
    }
    
    contents = contents.filter(e => e.step !== "tabFile");
    tabs.splice(contents.length, 1);

    if(isEmpty(contents)) return null;

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
              onClickEnd    = { btnEnd => this.setState({btnEnd})}
              setStatePrice = { this.setStatePrice }
              setStateLocal = { this.setStateLocal }
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
          discount          = { !!discount &&  !!discount.extra.house && !!discount.extra.house ? discount.extra.house : 0 }
          endClickProduct   = { this.endClickProduct }
          t                 = { t } />
        
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { product, profile, productDetail, setting } = state;
  return { product, profile, productDetail, setting };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productActions        : bindActionCreators(productActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
    settingActions       : bindActionCreators(settingActions, dispatch),
  };
};

export default withNotification(translate(['product'])(connect(mapStateToProps, mapDispatchToProps)(House)));