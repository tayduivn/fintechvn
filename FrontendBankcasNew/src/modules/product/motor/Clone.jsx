import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import { Loading } from 'components';
import Form from './Form';

import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { withNotification } from 'components';
import { isEmpty } from 'utils/functions';
import { formatPrice } from 'utils/format';
import { Error404 } from 'modules';
import { actions as discountActions } from 'modules/setting/discount';

class Clone extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      isWorking : false,
      btnEnd    : false,
      endClick  : false,
      stepBegin : true,
      didMount  : false,
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

  endClickProduct = () => {
    this.setState({endClick: true, nextchange: Date.now()});
  }

  setStatePrice = (e) => {
    let { key, value } = e;
    !!key && !!value && this.setState({
      listInfo: {
        ...this.state.listInfo,
        [key] : value
      }
    })
  }

  formSubmit = (data) => {
    let { productDetailActions, profile, product } = this.props;

    let { listInfo, sumPrice, price, addressCustomer, discount, priceVAT, sumPriceVAT } = this.state;
    let { options } = listInfo._getRuleExtends
    let { id } = product.data.motor;
    
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

  hanndelSenUpdateSuccess = () => {
    this.props.notification.s('Message','Update seccess.');
    this.setState({endClick: false, nextchange: 0})
  }

  handelError = (e) => this.props.notification.e('Error', e.messagse);
  handleSuccess = (data) => this.props.history.push(`/product/motor/${data.id}`);

  discountCheckBox = ({select, discount}) => { 
    let fl = !!select ? select.checked : false;
    if(!fl)  discount = 0;
    this.setState({discount});
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

  componentWillMount(){
    let { product, profile, productActions, productDetail, productDetailActions, match, discountActions } = this.props;
    
    let { id }        = match.params;
    let dataRequest   = productDetail.data[id];

    let where  = { type: "discount", insur_id: profile.info.agency.insur_id};

    discountActions.fetchAll(null, 0, 0, where);
    
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
    

    if(!product.data.motor) productActions.fetchProduct('motor');
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

  handelError = (err) => this.props.notification.e('Error', err.messagse);

  render() { 
    
    let { product, match, productDetail, t, discount } = this.props;
    let { id }        = match.params;
    
    if( product.isWorking  || productDetail.isWorking) return <Loading />

    let dataRequest = productDetail.data[id];
    if(!product.data.motor || !dataRequest || !dataRequest.product || dataRequest.product.type !== "motor") return (<Error404 />);
    
    let { endClick, listInfo, price, sumPrice, isWorking, disPrice, priceVAT, sumPriceVAT } = this.state;

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
        if(!!controls && !isEmpty(controls)){
          contents.push({controls, step});
        }
        
      }
    }

    contents = contents.filter(e => e.step !== "tabFile");
    tabs.splice(contents.length, 1);

    return (
      <div className={`row ${!!isWorking ? 'loading' : '' }`}>
        <div className="col-sm-9">
          <div className="white-box">
            <h3 className="box-title m-b-0">{t('product:motor_createRequest')}</h3>
            <p className="text-muted m-b-10 font-13">{t('product:motor_descCreateRes')}</p>

            <Form
              contents    = { contents }
              endClick    = { endClick }
              formSubmit  = { this.formSubmit }
              _ftHandlerEvent   = { this._ftHandlerEvent }
              callbackFunction  = { this.callbackFunction }
              dataRequest = { dataRequest }
              onClickEnd  = { btnEnd => this.setState({btnEnd, nextchange: Date.now()})}
              stepBegin   = { stepBegin => this.setState({stepBegin}) }
              handelRemoveClick = { this.handelRemoveClick }
              t                 = { t }
              setStatePrice     = { this.setStatePrice }
              setStateLocal     = { this.setStateLocal }
              tabs              = { tabs } />

          </div>
        </div>
        <div className="col-sm-3 p-l-0 productLeft">

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
                  id      = { 'checkbox' }
                  onClick = { () => this.discountCheckBox({select: this._discountCheckBox, discount: !!discount.item.motor ? discount.item.motor : 0}) }
                  ref     = { el => this._discountCheckBox = el } type="checkbox" />
                <label htmlFor={'checkbox'} > {t('product:discount')} { !!discount.item.motor ? discount.item.motor : 0 } % </label>
              </div>
            </div>

            <div className="col-sm-12 p-0">
              {
                <button onClick={this.endClickProduct} className="btn btn-flat btn-success btn-block fcbtn btn-outline btn-1e">{t('product:motor_btnSubmit')}</button>
              }
            </div>
            <div className="clear"></div>
          </div>
        </div>
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
    productActions       : bindActionCreators(productActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
    discountActions       : bindActionCreators(discountActions, dispatch),
  };
};

export default withNotification(translate(['product'])(connect(mapStateToProps, mapDispatchToProps)(Clone)));