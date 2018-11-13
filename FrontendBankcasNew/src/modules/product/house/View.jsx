import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import Form from './Form';
import Right from './Right';

import { actions as yearsActions } from 'modules/categories/years';
import * as productActions from './../actions';
import { actions as productDetailActions } from 'modules/productDetail';
import { Loading, withNotification } from 'components';
import { isEmpty } from 'utils/functions';
import { Error404 } from 'modules';

class View extends Component {
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
      },
      price     : 0,
      sumPrice  : 0,
      nextchange: 0
    }
  }

  componentWillMount(){
    let { product, profile, years, productActions, yearsActions, productDetail, productDetailActions, match } = this.props;
    
    let { id }        = match.params;
    let dataRequest   = productDetail.data[id];

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
    
    if(years.ordered.length === 0) yearsActions.fetchAll({}, 0, 0, {insur_id: profile.info.agency.insur_id});

    if(!product.data.house) productActions.fetchProduct('house');
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

  setInfoProduct = (dataRequest) => {
    let state = {
      price : dataRequest.detail && dataRequest.detail.price ? dataRequest.detail.price : 0,
      sumPrice: dataRequest.price ? dataRequest.price : 0,
      listInfo : !!dataRequest.detail.listInfo ? { ...dataRequest.detail.listInfo} : this.state.listInfo
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
    !!key && !!value && this.setState({
      ...this.state,
      [key] : value
    })
  }

  render() { 
    
    let { product, match, productDetail, years, t } = this.props;
    let { id }        = match.params;
    
    if( product.isWorking  || productDetail.isWorking || years.isWorking) return <Loading />

    let dataRequest = productDetail.data[id];
    if(!product.data.house || !dataRequest ||  !dataRequest.product || dataRequest.product.type !== "house") return (<Error404 />);
    
    let { btnEnd, listInfo, price, sumPrice } = this.state;

    let newListInfo = [];
    for(let key in listInfo){
      let newlist = {};
      if(!isEmpty(listInfo[key])) newlist = listInfo[key];
      newListInfo.push(newlist);
    }

    let tabs      = [];
    let contents  = [];

    if(!!product.data.house){
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

      product.data.house.steps['tabFile'] = tabFile;

      for(let step in product.data.house.steps){
        let { name, icon, lang, controls } = product.data.house.steps[step];
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
                contents    = { contents }
                dataRequest = { dataRequest }
                view        = { true }
                t           = { t }
                setStatePrice     = { this.setStatePrice }
                setStateLocal     = { this.setStateLocal }
                tabs        = { tabs } />

            </div>
          </div>
          <Right
            listInfo    = { listInfo }
            price       = { price }
            sumPrice    = { sumPrice }
            btnEnd      = { btnEnd }
            endClickProduct  = { this.endClickProduct }
            dataRequest      = { dataRequest }
            onClickSendCIS   = { this.onClickSendCIS }
            t           = { t } />
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
    productDetailActions  : bindActionCreators(productDetailActions, dispatch)
  };
};

export default withNotification(translate(['product'])(connect(mapStateToProps, mapDispatchToProps)(View)));