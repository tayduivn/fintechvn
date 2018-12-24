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
import { Error404 } from 'modules';
import Right from './Right';
import { actions as settingActions } from 'modules/setting';

class Clone extends Component {

  constructor(props){
    super(props);
    this.state = {
      btnEnd    : false,
      endClick  : false,
      stepBegin : true,
      isWorking : false,
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
    let { product, profile, productActions, productDetail, productDetailActions, match, settingActions } = this.props;
    
    let { id }        = match.params;
    let dataRequest   = productDetail.data[id];

    let where  = { type: "discount", insur_id: profile.info.agency.insur_id};
    settingActions.fetchAll(null, 0, 0, where);

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
    
    if(!product.data.house) productActions.fetchProduct('house');
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

  setInfoProduct = (dataRequest) => {
    let state = {
      price           : dataRequest.detail && dataRequest.detail.price ? dataRequest.detail.price : 0,
      sumPrice        : dataRequest.price ? dataRequest.price : 0,
      listInfo        : !!dataRequest.detail.listInfo ? { ...dataRequest.detail.listInfo} : this.state.listInfo,
      addressCustomer : dataRequest.detail && dataRequest.detail.addressCustomer ? dataRequest.detail.addressCustomer : {},
      discount    : dataRequest.detail && dataRequest.detail.discount ? dataRequest.detail.discount : 0,
      sumPriceVAT : dataRequest.detail && dataRequest.detail.sumPriceVAT ? dataRequest.detail.sumPriceVAT : 0,
      priceVAT    : dataRequest.detail && dataRequest.detail.priceVAT ? dataRequest.detail.priceVAT : 0,
    };
    
    this.setState({...state});
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

  endClickProduct = () => this.setState({endClick: true});

  formSubmit = (data) => {
    let { productDetailActions, profile, product } = this.props;
    let { listInfo, sumPrice, price, addressCustomer, discount, priceVAT, sumPriceVAT } = this.state;
    
    let { options } = listInfo._getRuleExtends
    let { id } = product.data.house;

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
      insur_id    : profile.info.agency.insur_id,
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

  onClickSendCIS = () => {
    let { productDetailActions, notification, match, productDetail } = this.props;
    let { id }        = match.params;

    let data = productDetail.data[id];
    // this.setState({endClick: true});

    if(!!data && !isEmpty(data) && !!data.file && !isEmpty(data.file)){
      if((data.status === 0 || data.status === 2)){
        productDetailActions.updateById(id, {status: 1})
          .then(res => {
            if(res.error) return Promise.reject(res.error);
            notification.s('Message', 'Send CIS Success');
            this.props.history.push(`/product/house/view/${id}`)
          })
          .catch(e => this.handelError(e));
      }else notification.e('Message', 'You not permission')
    }else notification.e('Message', 'File not exist')
  }

  discountCheckBox = ({select, discount}) => {
    let fl = !!select ? select.checked : false;
    if(!fl)  discount = 0;
    this.setState({discount});
  }

  handleSuccess = (data) => this.props.history.push(`/product/house/${data.id}`);
  handelError = (err) => this.props.notification.e('Error', err.messagse);

  render() { 
    
    let { product, match, productDetail, t, setting } = this.props;
    let { id }        = match.params;
    
    if(product.isWorking || productDetail.isWorking || setting.isWorking) return <Loading />;

    let discount = !!setting && !!setting.item.discount ? setting.item.discount : null;

    let dataRequest = productDetail.data[id];
    if(!product.data.house || !dataRequest || !dataRequest.product || dataRequest.product.type !== "house") return (<Error404 />);
    
    let { btnEnd, endClick, listInfo, price, sumPrice, isWorking, disPrice, priceVAT, sumPriceVAT } = this.state;

    let newListInfo = [];
    for(let key in listInfo){
      let newlist = {};
      if(!isEmpty(listInfo[key])) newlist = listInfo[key];
      newListInfo.push(newlist);
    }

    let tabs      = [];
    let contents  = [];

    if(!!product.data.house){

      for(let step in product.data.house.steps){
        let { name, icon, lang, controls } = product.data.house.steps[step];
        tabs.push({name, icon, lang});
        if(!!controls && !isEmpty(controls)){
          contents.push({controls, step});
        }
        
      }
    }

    contents = contents.filter(e => e.step !== "tabFile");
    tabs.splice(contents.length, 1);

    if(isEmpty(contents)) return null;

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
              t                 = { t }
              setStatePrice     = { this.setStatePrice }
              setStateLocal     = { this.setStateLocal }
              tabs              = { tabs } />

          </div>
        </div>
        <Right
          listInfo    = { listInfo }
          price       = { price }
          sumPrice    = { sumPrice }
          btnEnd      = { btnEnd }
          endClickProduct  = { this.endClickProduct }
          dataRequest      = { dataRequest }
          disPrice         = { disPrice }
          priceVAT         = { priceVAT }
          sumPriceVAT      = { sumPriceVAT }
          discount          = { !!discount &&  !!discount.extra.house && !!discount.extra.house ? discount.extra.house : 0 }
          onClickSendCIS   = { this.onClickSendCIS }
          discountCheckBox = { this.discountCheckBox }
          clone       = { true }
          t           = { t } />
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
    productActions       : bindActionCreators(productActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
    settingActions       : bindActionCreators(settingActions, dispatch),
  };
};

export default withNotification(translate(['product'])(connect(mapStateToProps, mapDispatchToProps)(Clone)));