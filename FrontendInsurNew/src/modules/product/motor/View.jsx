import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import Form from './Form';

import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import { actions as yearsActions } from 'modules/categories/years';
import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { Loading, AlertConfirm, withNotification, Modal } from 'components';
import { isEmpty, getTimeNext } from 'utils/functions';
import { actions as messageActions } from 'modules/categories/messages';
import { formatPrice, convertDMY } from 'utils/format';
import { Error404 } from 'modules';
import { validate } from 'utils/validate';
import { CODE } from 'config/constants';

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
      price     : 0,
      sumPrice  : 0,
      nextchange: 0
    }
  }

  handelError = (e) => this.props.notification.e('Error', e.messagse);

  componentWillMount(){
    let { match, product, profile, years, productActions, yearsActions, productDetail,
      productDetailActions, breadcrumbActions } = this.props;
    
    let { id }        = match.params;
    let dataRequest   = productDetail.data[id];

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
      price : dataRequest.detail && dataRequest.detail.price ? dataRequest.detail.price : 0,
      sumPrice: dataRequest.price ? dataRequest.price : 0,
      listInfo : !!dataRequest.detail.listInfo ? { ...dataRequest.detail.listInfo} : this.state.listInfo
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
        })
        .catch(e => this.handelError(e))
        .finally(() => this.setState({idCancel: null}))
    }
  }

  onSuccessItem = () => {
    let { idSuccess } = this.state;

    let { productDetailActions } = this.props;
    let dateNow = Date.now();

    let data = {
      status    : 3,
      payDay    : getTimeNext(dateNow, 1),
      startDay  : dateNow,
      endDay    : getTimeNext(dateNow, 12),
      code      : `${CODE}${dateNow}`
    }

    productDetailActions.updateById(idSuccess, data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        this.props.notification.s('Messagse', 'Access request success')
      })
      .catch(e => this.handelError(e))
      .finally(() => this.setState({idSuccess: null}))
  }

  handelError = (e) => this.props.notification.e('Error', e.messagse);

  render() { 
    
    let { product, match, productDetail, years, t } = this.props;
    let { id }        = match.params;
    
    if( product.isWorking || productDetail.isWorking || years.isWorking) return <Loading />

    let dataRequest = productDetail.data[id];
    if(!product.data.motor || !dataRequest) return (<Error404 />);
    
    let { listInfo, price, sumPrice, idCancel, idSuccess } = this.state;

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

        {
          idSuccess
          ?
          ( 
            <AlertConfirm
              onCancel= { () => this.setState({idSuccess: null})}
              onSuccess= { this.onSuccessItem }
              title="Are you sure!"/>
          )
          : null
        }
        <div className="row">
        <div className="col-sm-9">
          <div className="white-box">
            <h3 className="box-title m-b-0">Tạo yêu cầu</h3>
            <p className="text-muted m-b-10 font-13">Vui lòng thực hiện đầy đủ các bước.</p>

            <Form
              contents    = { contents }
              dataRequest = { dataRequest }
              t           = { t }
              view        = { true }
              tabs        = { tabs } />

          </div>
        </div>
        <div className="col-sm-3 p-l-0 productLeft">
          {
            dataRequest.status === 3
            ? (
              <div className="white-box">
                <div className="col-md-6 text-center bd-r">
                  <label className="strong">Ngày bắt đầu</label>
                  <p className="form-control-static">
                    { (dataRequest.startDay) ? convertDMY(dataRequest.startDay, '.') : ''}
                  </p>
                </div>
                <div className="col-md-6 text-center">
                  <label className="strong">Ngày bắt đầu</label>
                  <p className="form-control-static">
                    { (dataRequest.endDay) ? convertDMY(dataRequest.endDay, '.') : ''}
                  </p>
                </div>
                <div className="col-md-12 text-center m-t-5" style={{background: "hsla(0,0%,78%,.2)", padding: '10px'}}>
                  <h3 >
                    <small style={{fontSize: '18px', fontWeight: '700'}}>Hạn thanh toán</small>
                  </h3>
                  <p className="form-control-static">
                    { (dataRequest.payDay) ? convertDMY(dataRequest.payDay, '.') : ''}
                  </p>
                </div>
                <div className="clear"></div>
              </div>
            )
            : null
          }
        
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
            <h4 style={{fontSize: '13px'}} className="box-title m-b-0">Lựa chọn bổ sung</h4>
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
                !!dataRequest && dataRequest.status === 1
                ? (
                  <Fragment>
                    <button onClick={() => this.setState({idCancel: id})} style={{width: '45%', marginRight: '14px'}} className="col-md-6 btn btn-flat btn-danger fcbtn btn-outline btn-1e">
                      Không chấp nhận
                    </button>
                    <button onClick={() => this.setState({idSuccess: id})} className="col-md-6 btn btn-flat btn-success fcbtn btn-outline btn-1e">
                      Chấp nhận
                    </button>
                  </Fragment>
                  )
                : null
              }
            </div>
            <div className="clear"></div>
          </div>
        </div>
      </div>
      </Fragment>
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
    yearsActions          : bindActionCreators(yearsActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
    breadcrumbActions     : bindActionCreators(breadcrumbActions, dispatch),
    messageActions        : bindActionCreators(messageActions, dispatch),
  };
};

export default withNotification(translate(['product'])(connect(mapStateToProps, mapDispatchToProps)(View)));