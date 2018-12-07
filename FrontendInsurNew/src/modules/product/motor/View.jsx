import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import Form from './Form';
import Right from './Right';

import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import { actions as yearsActions } from 'modules/categories/years';
import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { Loading, withNotification, Modal } from 'components';
import { isEmpty, getTimeNext } from 'utils/functions';
import { Error404 } from 'modules';
import { validate } from 'utils/validate';
import { actions as discountActions } from 'modules/setting/discount';

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
      sumPriceVAT : 0,
      nextchange  : 0,
      discount    : 0,
      disPrice    : 0,
      priceVAT    : 0,
      tnds        : 0,
      connguoi    : {},
      hanghoa     : 0,
    }
  }

  handelError = (e) => this.props.notification.e('Error', e.messagse);

  componentWillMount(){
    let { match, product, profile, years, productActions, yearsActions, productDetail,
      productDetailActions, breadcrumbActions, discountActions } = this.props;
    
    let { id }        = match.params;
    let dataRequest   = productDetail.data[id];
    let where  = { type: "discount", insur_id: profile.info.agency.id};

    discountActions.fetchAll(null, 0, 0, where);

    breadcrumbActions.set({
      page_name: 'Product',
      breadcrumb: [
        { name: "Product", liClass: "active" }
      ]
    });

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
      tnds            : dataRequest.detail && dataRequest.detail.tnds ? dataRequest.detail.tnds : 0,
      connguoi        : dataRequest.detail && dataRequest.detail.connguoi ? dataRequest.detail.connguoi : {},
      hanghoa         : dataRequest.detail && dataRequest.detail.hanghoa ? dataRequest.detail.hanghoa : 0,
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

    if(validate(this._codeText, 'str:3:100') ){
      let code = !!this._codeText ? this._codeText.value : "";
      
      if(isEmpty(Object.values(productDetail.data).filter(e => e.code === code))){
        let dateNow = Date.now();

        let data = {
          status    : 3,
          payDay    : getTimeNext(dateNow, 1),
          startDay  : dateNow,
          endDay    : getTimeNext(dateNow, 12),
          code
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
    let { price, listInfo, sumPrice, discount, tnds, connguoi, hanghoa } = this.state;
    tnds      = !!tnds ? tnds : 0;
    connguoi  = !!connguoi.fee ? connguoi.fee : 0;
    hanghoa   = !!hanghoa ? hanghoa : 0;

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
            
            sumPrice += priceMore;
            sumPrice += tnds;
            sumPrice += connguoi;
            sumPrice += hanghoa;
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

  render() { 
    
    let { product, match, productDetail, years, t, discount } = this.props;
    let { id }        = match.params;
    
    if( product.isWorking || productDetail.isWorking || years.isWorking) return <Loading />

    let dataRequest = productDetail.data[id];
    if(!product.data.motor || !dataRequest) return (<Error404 />);
    
    let { listInfo, price, sumPrice, idCancel, idSuccess, disPrice, priceVAT, sumPriceVAT, connguoi } = this.state;

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
          <input
            className     = {`form-control`}
            placeholder   = 'Code'
            ref           = {e => this._codeText = e}  />
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
          endClickProduct  = { this.endClickProduct }
          dataRequest      = { dataRequest }
          setStateLocal    = { this.setStateLocal }
          onClickSendCIS   = { this.onClickSendCIS }
          disPrice         = { disPrice }
          priceVAT         = { priceVAT }
          sumPriceVAT      = { sumPriceVAT }
          view             = { true }
          discount         = { !!discount.item.motor ? discount.item.motor : 0 }
          t                = { t } />
      </div>
      </Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  let { product, profile, productDetail } = state;
  let { years } = state.categories;
  let { discount } = state.setting;

  return { product, years, profile, productDetail, discount };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productActions        : bindActionCreators(productActions, dispatch),
    yearsActions          : bindActionCreators(yearsActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
    breadcrumbActions     : bindActionCreators(breadcrumbActions, dispatch),
    discountActions       : bindActionCreators(discountActions, dispatch),
  };
};

export default withNotification(translate(['product'])(connect(mapStateToProps, mapDispatchToProps)(View)));