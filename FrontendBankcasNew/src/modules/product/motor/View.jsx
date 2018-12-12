import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import Form from './Form';
import Right from './Right';

import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { Loading, withNotification } from 'components';
import { isEmpty } from 'utils/functions';
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
      priceVAT    : 0,
      tnds        : 0,
      connguoi    : {},
      hanghoa     : {},
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
    let { price, listInfo, sumPrice, discount, tnds, connguoi, hanghoa } = this.state;
    tnds      = !!tnds ? tnds : 0;
    connguoi  = !!connguoi.sumFee ? connguoi.sumFee : 0;
    hanghoa   = !!hanghoa.fee ? hanghoa.fee : 0;

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
      sumPrice += tnds;
      sumPrice += connguoi;
      sumPrice += hanghoa;

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
      tnds            : dataRequest.detail && dataRequest.detail.tnds ? dataRequest.detail.tnds : 0,
      connguoi        : dataRequest.detail && dataRequest.detail.connguoi ? dataRequest.detail.connguoi : {},
      hanghoa         : dataRequest.detail && dataRequest.detail.hanghoa ? dataRequest.detail.hanghoa : {},
    };
    
    this.setState({...state});
  }

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

  render() { 
    
    let { product, match, productDetail, t, discount } = this.props;
    let { id }        = match.params;
    
    if( product.isWorking || productDetail.isWorking) return <Loading />

    let dataRequest = productDetail.data[id];
    if(!product.data.motor || !dataRequest || dataRequest.status === 0) return (<Error404 />);
    
    let { btnEnd, listInfo, price, sumPrice, disPrice, priceVAT, sumPriceVAT, connguoi, hanghoa, tnds } = this.state;

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
                contents      = { contents }
                dataRequest   = { dataRequest }
                view          = { true }
                t             = { t }
                setStatePrice = { this.setStatePrice }
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
            connguoi    = { connguoi }
            hanghoa     = { hanghoa }
            tnds        = { tnds }
            priceVAT          = { priceVAT }
            sumPriceVAT       = { sumPriceVAT }
            discountCheckBox  = { this.discountCheckBox }
            discount          = { !!discount.item.motor ? discount.item.motor : 0 }
            endClickProduct   = { this.endClickProduct }
            dataRequest       = { dataRequest }
            view              = { true }
            t                 = { t } />
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