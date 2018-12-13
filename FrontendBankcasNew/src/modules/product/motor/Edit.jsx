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
import { Error404 } from 'modules';
import * as fileConfig from 'config/fileConfig';
import { actions as discountActions } from 'modules/setting/discount';

class Edit extends Component {
  _discountCheckBox = null;

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
      priceVAT    : 0,
      tnds        : 0,
      connguoi    : {},
      hanghoa     : {}
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
    if(!!key && undefined !== value && this.state.value !== value) 
      this.setState({
        listInfo: {
          ...this.state.listInfo,
          [key] : value
        }
      })
  }

  formSubmit = (data) => {
    let { match, productDetailActions } = this.props;
    let { id: idPro }        = match.params;
    let { listInfo, sumPrice, price, addressCustomer, discount, priceVAT, sumPriceVAT,
      tnds, connguoi, hanghoa } = this.state;
    let { options } = listInfo._getRuleExtends

    let detail = {
      ...data,
      price,
      discount,
      listInfo,
      priceVAT,
      sumPrice,
      sumPriceVAT,
      tnds,
      connguoi,
      hanghoa,
      ruleExtends: { ...options }
    };

    if(!!addressCustomer) detail.addressCustomer = addressCustomer;

    let dt = {
      detail,
      price       : sumPriceVAT
    }

    if(!this.state.isWorking){
      this.setState({isWorking: true});
      productDetailActions.updateById(idPro, {...dt})
        .then(res => {
          if(!!res.error) return Promise.reject(res.error);
          this.hanndelSenUpdateSuccess()
        }, e => Promise.reject(e))
        .catch(e => this.handelError(e))
        .finally(() => this.setState({isWorking: false}))
    }
    
  }

  hanndelSenUpdateSuccess = () => {
    this.props.notification.s('Message','Update seccess.');
    this.setState({endClick: false, nextchange: 0})
  }

  handelError = (e) => this.props.notification.e('Error', e.messagse);

  discountCheckBox = ({select, discount}) => {
    let fl = !!select ? select.checked : false;
    if(!fl)  discount = 0;
    this.setState({discount});
  }

  onClickSendCIS = () => {
    let { productDetailActions, notification, match, productDetail } = this.props;
    let { id }        = match.params;

    let data = productDetail.data[id];

    if(!!data && !isEmpty(data) && !!data.file && !isEmpty(data.file)){
      if((data.status === 0 || data.status === 2)){
        productDetailActions.updateById(id, {status: 1})
          .then(res => {
            if(res.error) return Promise.reject(res.error);
            notification.s('Message', 'Send CIS Success');
            this.props.history.push(`/product/motor/view/${id}`)
          })
          .catch(e => this.handelError(e));
      }else notification.e('Message', 'You not permission')
    }else notification.e('Message', 'File not exist')
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
      tnds            : dataRequest.detail && dataRequest.detail.tnds ? dataRequest.detail.tnds : 0,
      connguoi        : dataRequest.detail && dataRequest.detail.connguoi ? dataRequest.detail.connguoi : {},
      hanghoa         : dataRequest.detail && dataRequest.detail.hanghoa ? dataRequest.detail.hanghoa : {},
    };
    
    this.setState({...state});
  }

  onDropFile = (file) =>{
    let { productDetailActions, notification, match, productDetail } = this.props;
    let { id }        = match.params;
    file = file[0];
    let data = productDetail.data[id];
    
    if(!!data && !isEmpty(data) && (data.status === 0 || data.status === 2)){
      if(fileConfig.acceptTypeFile.indexOf(file.type) !== -1){
        if(fileConfig.maxFilesize >= file.size){
          let formData = new FormData();
          formData.append('file', file);
          
          productDetailActions.uploadFile(formData, id)
            .then(res => { 
              this.handelUploadSuccess(res)
            }, e => Promise.reject(e))
            .catch(e => this.handelError(e));
          
        } else notification.e('Error', 'File size invalid');
      } else notification.e('Error', 'Type file invalid');
    }
  }

  handelUploadSuccess = (data) => {
    if(!data) this.props.notification.e('Error', 'File not update.');
    else this.props.notification.s('Message', 'Upload file success.');

    this.setState({...this.state, nextchange: Date.now()})
  }

  handelError = (err) => this.props.notification.e('Error', err.messagse);

  handelRemoveClick = (name) => {
    let { productDetailActions, match } = this.props;
    let { id }        = match.params;

    productDetailActions.removeFile(name, id)
      .then(res => {
        if(!!res.error) return Promise.reject(res.error)
        this.handelRemoveFileSuccess();
      }, e => Promise.reject(e))
      .catch(e => this.handelError(e))
      .finally(e => this.setState({...this.state, nextchange: Date.now()}));
  }

  handelRemoveFileSuccess = (data) => this.props.notification.s('Error', 'File delete success.');

  componentWillReceiveProps(){
    let { match, productDetail } = this.props;
    let { id }        = match.params;
    let dataRequest = productDetail.data[id];

    !!dataRequest && this.setInfoProduct(dataRequest)
  }

  render() { 
    
    let { product, match, productDetail, t, discount, seats } = this.props;
    let { id }        = match.params;
    
    if( product.isWorking  || productDetail.isWorking) return <Loading />

    let dataRequest = productDetail.data[id];
    if(!product.data.motor || !dataRequest || !dataRequest.product || dataRequest.product.type !== "motor") return (<Error404 />);

    let { btnEnd, endClick, listInfo, price, sumPrice, isWorking, disPrice, priceVAT, sumPriceVAT,
      connguoi, hanghoa, tnds } = this.state;

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

    let events = {
      file : {
        onDrop : this.onDropFile,
      }
    }
    
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
              didMount    = { () => isFnStatic('onLoadEidt', {component: this})}
              events      = { events }
              handelRemoveClick = { this.handelRemoveClick }
              t                 = { t }
              setStatePrice     = { this.setStatePrice }
              setStateLocal     = { this.setStateLocal }
              view              = { !!dataRequest && dataRequest.status === 1 ? true : false }
              stateLocal        = { this.state }
              tabs              = { tabs } />

          </div>
        </div>
        <Right
          listInfo    = { listInfo }
          price       = { price }
          sumPrice    = { sumPrice }
          connguoi    = { connguoi }
          hanghoa     = { hanghoa }
          tnds        = { tnds }
          btnEnd      = { btnEnd }
          seats       = { seats }
          disPrice    = { disPrice }
          priceVAT          = { priceVAT }
          sumPriceVAT       = { sumPriceVAT }
          discountCheckBox  = { this.discountCheckBox }
          discount          = { !!discount.item.motor ? discount.item.motor : 0 }
          endClickProduct   = { this.endClickProduct }
          dataRequest       = { dataRequest }
          setStateLocal     = { this.setStateLocal }
          onClickSendCIS    = { this.onClickSendCIS }
          t                 = { t } />
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { product, profile, productDetail, categories } = state;
  let { seats } = categories;
  let { discount } = state.setting;

  return { product, profile, productDetail, discount, seats };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productActions       : bindActionCreators(productActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
    discountActions       : bindActionCreators(discountActions, dispatch),
  };
};

export default withNotification(translate(['product'])(connect(mapStateToProps, mapDispatchToProps)(Edit)));