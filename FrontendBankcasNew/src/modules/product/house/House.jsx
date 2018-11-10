import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import { Loading, withNotification } from 'components';
import { isEmpty } from 'utils/functions';

import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';

import Form from './Form';
import Right from './Right';

class House extends Component {

  constructor(props){
    super(props);
    this.state = {
      btnEnd    : false,
      endClick  : false,
      stepBegin : true,
      listInfo  : {
        _houseValue: {},
        _getRangeYear: {},
        _getRuleExtends: {
          name: "Lựa chọn bổ sung", options: {}
        },
      },
      price     : 0,
      sumPrice  : 0,
      nextchange: 0
    }
  }

  componentDidUpdate(nextProps, nextState){
    let { price, listInfo, sumPrice, stepBegin } = this.state;

    let { _getRuleExtends } = listInfo;

    if( !!stepBegin ){
      sumPrice = price;
      let priceMore = 0;

      if(!isEmpty(_getRuleExtends.options)){
        for(let key in _getRuleExtends.options){
          let { price: pri } = _getRuleExtends.options[key];
          priceMore += parseFloat(pri);
        }
      }

      sumPrice += priceMore;

      if(this.state.price !== price || this.state.sumPrice !== sumPrice)
        this.setState({price, sumPrice});
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
    !!key && !!value && this.setState({
      ...this.state,
      [key] : value
    })
  }

  componentDidMount(){
    let { product, profile, productActions, productDetail, productDetailActions } = this.props;

    if(productDetail.ordered.length === 0) productDetailActions.fetchAll({
      include: [
        {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
        {relation: "product", scope: { fields: { name: true, type: true }}},
      ],
      order: "id DESC"
    }, 0, 0, {agency_id: profile.info.agency.id});

    if(!product.data.house) productActions.fetchProduct('house')
      .then(res => { 
        // if(!!res && !!res.data) isFnStatic('onLoad', {component: this});
      });
      
  }

  endClickProduct = () => this.setState({endClick: true});

  formSubmit = (data) => {
    let { profile, product, productDetailActions } = this.props;
    let { listInfo, sumPrice, price } = this.state;
    let { id } = product.data.house;
    let { options } = listInfo._getRuleExtends

    let detail = {
      ...data,
      price: price,
      listInfo,
      ruleExtends: { ...options}
    };

    let dt = {
      detail,
      created_by  : profile.info.id,
      product_id  : id,
      insur_id   : profile.info.agency.insur_id,
      bankcas_id  : profile.info.agency.bankcas_id,
      agency_id   : profile.info.agency.id,
      create_at   : Date.now(),
      price       : sumPrice
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
    let { product, productDetail, t } = this.props;
    let { btnEnd, endClick, listInfo, price, sumPrice } = this.state;

    if(product.isWorking || productDetail.isWorking) return <Loading />;
    
    let tabs      = [];
    let contents  = [];
    // console.log(product.data, '111111111111111111111')
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
              stepBegin     = { stepBegin => this.setState({stepBegin}) }
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
          endClickProduct  = { this.endClickProduct }
          t           = { t } />
        
      </div>
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
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
  };
};

export default withNotification(translate(['product'])(connect(mapStateToProps, mapDispatchToProps)(House)));