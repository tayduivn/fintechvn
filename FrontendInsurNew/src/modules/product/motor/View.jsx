import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Loading } from 'components';
import Form from './Form';

import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import { actions as yearsActions } from 'modules/categories/years';
import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { withNotification } from 'components';
import { isEmpty } from 'utils/functions';
import { formatPrice } from 'utils/format';
import { Error404 } from 'modules';

class View extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      btnEnd    : false,
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
    let { product, profile, years, productActions, yearsActions, productDetail, productDetailActions, breadcrumbActions } = this.props;
    
    breadcrumbActions.set({
      page_name: 'Product',
      breadcrumb: [
        { name: "Product", liClass: "active" }
      ]
    });

    if(years.ordered.length === 0) yearsActions.fetchAll({}, 0, 0, {insur_id: profile.info.agency.insur_id});

    if(!product.data.motor) productActions.fetchProduct('motor');

    if(productDetail.ordered.length === 0) productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true, type: true }}},
        ]
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
        
        if(!!dataRequest) {
          let state = {
            price : dataRequest.detail && dataRequest.detail.price ? dataRequest.detail.price : 0,
            sumPrice: dataRequest.price ? dataRequest.price : 0,
            listInfo : {
              ...dataRequest.detail.listInfo,
              _getRuleExtends : {
                name: "Lựa chọn bổ sung", options: {
                  ...dataRequest.detail.ruleExtends
                }
              }
            }
          }

          this.setState({...state})
        }
      }
      
    });
  }

  render() { 
    
    let { product, match, productDetail, years } = this.props;
    let { id }        = match.params;
    
    if( product.isWorking || productDetail.isWorking || years.isWorking) return <Loading />

    let dataRequest = productDetail.data[id];
    if(!product.data.motor || !dataRequest) return (<Error404 />);
    
    let { btnEnd, listInfo, price, sumPrice } = this.state;

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

    return (
      <div className="row">
        <div className="col-sm-9">
          <div className="white-box">
            <h3 className="box-title m-b-0">Tạo yêu cầu</h3>
            <p className="text-muted m-b-10 font-13">Vui lòng thực hiện đầy đủ các bước.</p>

            <Form
              contents    = { contents }
              dataRequest = { dataRequest }
              tabs        = { tabs } />

          </div>
        </div>
        <div className="col-sm-3 p-l-0 productLeft">
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
                !!dataRequest && dataRequest.status === 0
                ? (<button onClick={ this.onClickSendCIS } className="btn m-b-15 btn-flat btn-info btn-block fcbtn btn-outline btn-1e">Gửi đến CIS</button>)
                : null
              }
              {
                !!btnEnd && !!dataRequest && dataRequest.status === 0
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
    productActions        : bindActionCreators(productActions, dispatch),
    yearsActions          : bindActionCreators(yearsActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
    breadcrumbActions     : bindActionCreators(breadcrumbActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(View));