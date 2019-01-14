import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import Form from './Form';
import Right from './Right';
import FormAccess from 'modules/requests/FormAccess';

import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { Loading, withNotification, Modal } from 'components';
import { isEmpty, getTimeNext, getTimeNextDay } from 'utils/functions';
import { Error404 } from 'modules';
import { validate, validateForm } from 'utils/validate';
import { actions as settingActions } from 'modules/setting';

class View extends Component {
  _inputText = null;

  constructor(props){
    super(props);
    this.state = {
      idCancel  : null,
      idSuccess : null,
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
      priceMore   : 0,
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

  handelError = (e) => this.props.notification.e('Error', e.messagse);

  componentWillMount(){
    let { match, product, profile, productActions, productDetail,
      productDetailActions, settingActions } = this.props;
    
    let { id }        = match.params;
    let dataRequest   = productDetail.data[id];
    let where  = { type: "discount", insur_id: profile.info.agency.id};

    settingActions.fetchAll(null, 0, 0, where);

    if(!product.data.motor) productActions.fetchProduct('motor');

    if(!dataRequest){
      productDetailActions.fetchAll(
        {
          include: [
            {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
            {relation: "product", scope: { fields: { name: true, type: true }}},
          ],
          order: "id DESC"
        }, 0, 0, {
          and : [
            { or: [{status: 1}, {status: 3}] },
            { insur_id: profile.info.agency.id }
          ]
        }
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
      price           : dataRequest.detail && dataRequest.detail.price ? dataRequest.detail.price : 0,
      sumPrice        : dataRequest.price ? dataRequest.price : 0,
      listInfo        : !!dataRequest.detail.listInfo ? { ...dataRequest.detail.listInfo} : this.state.listInfo,
      addressCustomer : dataRequest.detail && dataRequest.detail.addressCustomer ? dataRequest.detail.addressCustomer : {},
      discount        : dataRequest.detail && dataRequest.detail.discount ? dataRequest.detail.discount : 0,
      sumPriceVAT     : dataRequest.detail && dataRequest.detail.sumPriceVAT ? dataRequest.detail.sumPriceVAT : 0,
      priceVAT        : dataRequest.detail && dataRequest.detail.priceVAT ? dataRequest.detail.priceVAT : 0,
      tnds            : dataRequest.detail && dataRequest.detail.tnds ? dataRequest.detail.tnds : {},
      connguoi        : dataRequest.detail && dataRequest.detail.connguoi ? dataRequest.detail.connguoi : {},
      hanghoa         : dataRequest.detail && dataRequest.detail.hanghoa ? dataRequest.detail.hanghoa : {},
    };
    
    this.setState({...state});
  }

  clickSendMess = () => {
    let {idCancel} = this.state;
    let messagse = (this._inputText != null) ? this._inputText.value : null;

    if(validate(this._inputText, 'str:3:500') && !!messagse){

      this.props.productDetailActions.updateById(idCancel, {status: 2, messagse})
        .then(res => {
          if(!!res.error) return Promise.reject(res.error);
          this.props.notification.s('Messagse', 'Send messagse success.');
          // this.props.history.push(`/requests`);
        })
        .catch(e => {
          this.handelError(e);
          // this.setState({idCancel: null})
        })
        .finally(() => this.setState({idCancel: null}));
    }
  }

  onSuccessItem = () => {
    let { idSuccess } = this.state;
    let { productDetail, productDetailActions, notification } = this.props;
    let dataValue = productDetail[idSuccess];
    let r = [
      { id: 'code', rule: 'str:3:100'},
      { id: 'noteVCX', rule: 'str:3:250'},
    ];

    if(!!dataValue 
      && !!dataValue.detail && !!dataValue.detail.tnds
      && dataValue.detail.tnds.feeTnds ) r.push({ id: 'noteTNDS', rule: 'str:3:250'});

    if(validateForm(this._formAccess, r) ){
      let code      = !!this._codeText ? this._codeText.value : "";
      let noteVCX   = !!this._noteVCXText ? this._noteVCXText.value : "";
      let noteTNDS  = !!this._noteTNDSText ? this._noteTNDSText.value : "";
      
      if(isEmpty(Object.values(productDetail.data).filter(e => e.code === code))){
        let dateNow = Date.now();

        let data = {
          status    : 3,
          payDay    : getTimeNextDay(dateNow, 30),
          startDay  : dateNow,
          endDay    : getTimeNext(dateNow, 12),
          code,
          noteVCX,
          noteTNDS
        }

        productDetailActions.updateById(idSuccess, data)
          .then(res => { console.log(res)
            if(res.error) return Promise.reject(res.error);
            this.props.notification.s('Messagse', 'Access request success')
          })
          .catch(e => this.handelError(e))
          .finally(() => this.setState({idSuccess: null}))
      }else notification.e('Message', 'Code already exists');
    }
  }

  handelError = (e) => this.props.notification.e('Error', e.message || e.messagse);

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

  setStateLocal = (e) => {
    let { key, value } = e;
    !!key && undefined !== value && this.state[key] !== value && this.setState({
      [key] : value
    })
  }

  componentDidUpdate(nextProps, nextState){
    let { price, listInfo, sumPrice, priceMore, discount, tnds, connguoi, hanghoa } = this.state;

    connguoi  = !!connguoi.sumFee ? connguoi.sumFee : 0;
    hanghoa   = !!hanghoa.fee ? hanghoa.fee : 0;
    
    let { _getPriceCar, _getRuleExtends, _getSeatsPayload } = listInfo;

    if( !isEmpty(_getPriceCar) && !isEmpty(_getSeatsPayload)){
      let priceSum  = +_getPriceCar.value;
      let ratioSP   = _getSeatsPayload.ratio;

      price     = priceSum * ratioSP / 100;
      sumPrice  = price;
      priceMore = 0;

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
      discount = parseFloat(discount);
      if(!!discount) disPrice = sumPrice * (discount*1.0/100);
      sumPrice -= disPrice;

      let priceVAT = sumPrice * 0.1;

      if(!!tnds && !!tnds.feeTnds) {
        priceVAT += ( tnds.feeTnds * tnds.vat );
        sumPrice += tnds.feeTnds;
      }

      sumPrice += connguoi;
      sumPrice += hanghoa;

      let sumPriceVAT = sumPrice + priceVAT;
      
      if(this.state.price !== price || this.state.sumPrice !== sumPrice || this.state.priceMore !== priceMore || 
        this.state.disPrice !== disPrice || this.state.priceVAT !== priceVAT || this.state.sumPriceVAT !== sumPriceVAT)
        this.setState({price, sumPrice, disPrice, priceVAT, sumPriceVAT, priceMore});
    }
  }

  render() { 
    
    let { product, match, productDetail, t, setting } = this.props;
    let { id }        = match.params;
    
    if( product.isWorking || productDetail.isWorking || setting.isWorking) return <Loading />;

    let discount = !!setting && !!setting.item.discount ? setting.item.discount : null;

    let dataRequest = productDetail.data[id];
    if(!product.data.motor || !dataRequest) return (<Error404 />);
    
    let { listInfo, price, sumPrice, idCancel, idSuccess, disPrice, priceVAT,
      sumPriceVAT, connguoi, hanghoa, tnds, priceMore } = this.state;

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

    let buttons = [
      <button key="2" onClick={() => this.setState({idCancel: null})} className="btn btn-danger btn-flat" type="submit">Canncel</button>,
      <button key="1" onClick={ this.clickSendMess } className="btn btn-success btn-flat" type="submit">Send</button>
    ];

    let buttonSucess = [
      <button key="2" onClick={() => this.setState({idSuccess: null})} className="btn btn-danger btn-flat" type="submit">Canncel</button>,
      <button key="1" onClick={ this.onSuccessItem } className="btn btn-success btn-flat" type="submit">Send</button>
    ];

    return (
      <Fragment>
        <Modal
          open    = { idCancel ? true : false }
          buttons = { buttons }
          header  = "Message" >
          <textarea
            ref = {e => this._inputText = e}
            className = {`form-control`}
            placeholder   = 'Message'
            rows          = {3}
            ></textarea>
        </Modal>

       <Modal
          open    = { idSuccess ? true : false }
          buttons = { buttonSucess }
          header  = "Code" >
          <FormAccess
            dataValue     = { !!dataRequest ? dataRequest : null}
            _noteTNDSText = { e => this._noteTNDSText = e }
            _noteVCXText  = { e => this._noteVCXText = e }
            _codeText     = { e => this._codeText = e }
            _formAccess   = { e => this._formAccess = e } />
          {/* <input
            className     = {`form-control`}
            placeholder   = 'Code'
            ref           = {e => this._codeText = e}  /> */}
        </Modal>

        <div className="row">
        <div className="col-sm-9">
          <div className="white-box">
            <h3 className="box-title m-b-0">Tạo yêu cầu</h3>
            <p className="text-muted m-b-10 font-13">Vui lòng thực hiện đầy đủ các bước.</p>

            <Form
              contents      = { contents }
              dataRequest   = { dataRequest }
              t             = { t }
              view          = { true }
              setStatePrice = { this.setStatePrice }
              tabs          = { tabs } />

          </div>
        </div>
        <Right
          listInfo    = { listInfo }
          price       = { price }
          sumPrice    = { sumPrice }
          connguoi         = { connguoi }
          hanghoa          = { hanghoa }
          tnds             = { tnds }
          priceMore        = { priceMore }
          endClickProduct  = { this.endClickProduct }
          dataRequest      = { dataRequest }
          setStateLocal    = { this.setStateLocal }
          onClickSendCIS   = { this.onClickSendCIS }
          disPrice         = { disPrice }
          priceVAT         = { priceVAT }
          sumPriceVAT      = { sumPriceVAT }
          view             = { true }
          discount          = { !!discount &&  !!discount.extra.motor && !!discount.extra.motor ? discount.extra.motor : 0 }
          t                = { t } />
      </div>
      </Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  let { product, profile, productDetail, categories, setting } = state;
  let { seats } = categories;
  return { product, profile, productDetail, seats, setting };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productActions        : bindActionCreators(productActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
    settingActions       : bindActionCreators(settingActions, dispatch),
  };
};

export default withNotification(translate(['product'])(connect(mapStateToProps, mapDispatchToProps)(View)));