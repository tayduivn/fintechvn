import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Loading } from 'components';
import Form from './Form';

import { actions as yearsActions } from 'modules/categories/years';
import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { withNotification } from 'components';
import { isFnStatic, isEmpty } from 'utils/functions';
import { formatPrice } from 'utils/format';
import { Error404 } from 'modules';

class Edit extends Component {

  constructor(props){
    super(props);
    this.state = {
      btnEnd    : false,
      endClick  : false,
      listInfo  : {
        _getPriceCar: {},
        _getYearCar: {},
        _getCareType: {},
        _getSeatsPayload: {},
        _getRuleExtends: {
          name: "Lựa chọn thêm", options: {}
        },
      },
      price     : 0,
      sumPrice  : 0,
      nextchange: 0
    }
  }

  endClickProduct = () => {
    this.setState({endClick: true, nextchange: Date.now()});
  }

  formSubmit = (data) => {
    let { match, profile, product, productDetailActions } = this.props;
    let { id: idPro }        = match.params;
    let { listInfo, sumPrice } = this.state;
    let { id } = product.data.motor;
    let { options } = listInfo._getRuleExtends

    let detail = {
      ...data,
      ruleExtends: { ...options}
    };

    productDetailActions.updateById(idPro, {detail})
        .then(res => {
          if(!!res.error) return Promise.reject(res.error);
          this.hanndelSenUpdateSuccess()
        }, e => Promise.reject(e))
        .catch(e => this.handelError(e))
  }

  hanndelSenUpdateSuccess = () => {
    this.props.notification.s('Messagse','Update seccess.');
    this.setState({endClick: false, nextchange: Date.now()})
  }

  handelError = (e) => this.props.notification.e('Error', e.messagse);

  shouldComponentUpdate(nextProps, nextState){
    let { sumPrice, nextchange } = this.state;

    if(nextState.nextchange === 0 )
      return (
        ( sumPrice === 0 || sumPrice !== nextState.sumPrice) &&
        ( nextchange === 0 || nextchange !== nextState.nextchange)
      );
    else return nextchange !== nextState.nextchange;
  }

  componentDidUpdate(nextProps, nextState){
    let { price, listInfo, sumPrice } = nextState;

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
      this.setState({price, sumPrice});
    }
  }

  componentDidMount(){
    let { product, profile, years, productActions, yearsActions, productDetail, productDetailActions } = this.props;
    
    if(productDetail.ordered.length === 0) productDetailActions.fetchAll({
      include: [
        {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
        {relation: "product", scope: { fields: { name: true }}},
      ]
    }, 0, 0, {agency_id: profile.info.agency.id});
    if(years.ordered.length === 0) yearsActions.fetchAll({}, 0, 0, {insur_id: profile.info.agency.insur_id});

    if(!product.data.motor) productActions.fetchProduct('motor')
      .then(res => {
        // if(!!res.data) isFnStatic('onLoadEidt', {component: this});
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
    
    let { product, match, productDetail } = this.props;
    let { id }        = match.params;

    if(product.isWorking || productDetail.isWorking) return <Loading />

    let dataRequest = productDetail.data[id];
    if(!dataRequest) return (<Error404 />);
    
    let { btnEnd, endClick, listInfo, price, sumPrice } = this.state;

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
        let { name, icon, controls } = product.data.motor.steps[step];
        tabs.push({name, icon});

        contents.push({controls, step});
      }
    }

    return (
      <div className="row">
        <div className="col-sm-9">
          <div className="white-box">
            <h3 className="box-title m-b-0">Tạo yêu cầu {this.state.year} </h3>
            <p className="text-muted m-b-10 font-13">Vui lòng thực hiện đầy đủ các bước.</p>

            <Form
              contents    = { contents }
              endClick    = { endClick }
              formSubmit  = { this.formSubmit }
              _ftHandlerEvent = { this._ftHandlerEvent }
              callbackFunction = { this.callbackFunction }
              dataRequest = { dataRequest }
              onClickEnd  = { btnEnd => this.setState({btnEnd, nextchange: Math.random()})}
              didMount    = { () => isFnStatic('onLoadEidt', {component: this})}
              tabs        = { tabs } />

          </div>
        </div>
        <div className="col-sm-3 p-l-0">
          <div className="white-box">
            <h3 className="box-title m-b-0">Thông tin sản phẩm</h3>
            <ul className="wallet-list listInfoProduct">
              {
                newListInfo.map((e, i) => {
                  if(isEmpty(e) || e.options) return null;
                  return (
                    <li key={i}>
                      <span className="pull-left"> <strong>{e.name ? e.name : ""}</strong> </span>
                      <span className="pull-right">{ undefined !== e.text ? e.text : ""}</span>
                      <div className="clear"></div>
                    </li>
                  )
                })
              }

              <li>
                <span className="pull-left text-info"> <strong>Thành tiền</strong> </span>
                <span className="pull-right text-danger"><strong>{formatPrice(price, 'VNĐ', 1)}</strong></span>
                <div className="clear"></div>
              </li>
            </ul>
            <h4 style={{fontSize: '13px'}} className="box-title m-b-0">Lựa chọn thêm</h4>
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

              <li>
                <span className="pull-left text-info"> <strong>Tổng tiền</strong> </span>
                <span className="pull-right text-danger"><strong>{formatPrice(sumPrice, 'VNĐ', 1)}</strong></span>
                <div className="clear"></div>
              </li>
            </ul>
            <div className="col-sm-12 p-0">
              {
                !!btnEnd
                ? (<button onClick={this.endClickProduct} className="btn btn-flat btn-success btn-block fcbtn btn-outline btn-1e">Lưu yêu cầu</button>)
                : null
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
  let { years } = state.categories;
  return { product, years, profile, productDetail };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productActions       : bindActionCreators(productActions, dispatch),
    yearsActions         : bindActionCreators(yearsActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(Edit));