import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Loading } from 'components';


import { actions as feeAssetHouseActions } from 'modules/categories/feeAssetHouse';
import { actions as feeNameExtendHouseActions } from 'modules/categories/feeNameExtendHouse';

import { isEmpty } from 'utils/functions';
import _ftNumber from 'utils/number';
import { formatPrice } from 'utils/format';

class PriceFastHouse extends React.Component {
  _assetHouseValue         = null;
  _yearHouseValue     = null;
  _feeNameExtend      = {};
  _feeAssetNameExtend = null;

  constructor(props){
    super(props);
    this.state = {
      price           : 0,
      feeHouseExtend  : null,
      feeExtend       : null
    }
  }

  componentDidMount(){
    let { profile, feeAssetHouse, feeNameExtendHouse,
      feeAssetHouseActions, feeNameExtendHouseActions, dataRequest } = this.props;

    let where = {insur_id: profile.info.agency.id, removed: 0};

    if(feeAssetHouse.ordered.length === 0) feeAssetHouseActions.fetchAll({}, 0, 0, where);
    if(feeNameExtendHouse.ordered.length === 0) feeNameExtendHouseActions.fetchAll({}, 0, 0, where);

    let rules = [
      {id: "assetHouseValue", rule: "num:1"}
    ];

    if(!!dataRequest && !!dataRequest.detail && !!dataRequest.detail.listInfo){
      let { _assetHouseValue } = dataRequest.detail.listInfo;
      let price = !!dataRequest.detail.assetHouseValue ? dataRequest.detail.assetHouseValue : 0;
      price = _ftNumber.parse(price);
      let feeExtend = !!_assetHouseValue && !!_assetHouseValue.options ? _assetHouseValue.options : null
      this.setState({price, feeExtend});
    }
    

    !!this.props.setRules && this.props.setRules(rules);


  }

  assetHouseValueChange = () => {
    if(!!this._assetHouseValue){
      _ftNumber.listener(this._assetHouseValue, {maxLength: 12});
      let price = _ftNumber.parse(_ftNumber.value(this._assetHouseValue));
     

      if(price > 0 && price > 999999999999) price = null;

      this.setState({price, feeHouseExtend: null, feeExtend: {}});
      if(!price){
        let stateRuleExtends = { key   : "_assetHouseValue", value: {name: "Lựa chọn thêm", options: {}} };
        !!this.props.setStatePrice && this.props.setStatePrice(stateRuleExtends);
      }
    }
  }

  ruleExtendsClick = ({key, id, price, name}) => () => {
    let selector = !!this._feeNameExtend[key] ? this._feeNameExtend[key] : null;
 
    let { feeExtend } = this.state;
    feeExtend = !!feeExtend ? feeExtend : {};
    let state = { key   : "_assetHouseValue", value: {name: "Lựa chọn thêm", options: {}} };

    if(!!id && !!price && !!selector){
      let fl = selector.checked;
      if(!!fl) {
        feeExtend[id] = {name, price};

        let option = {name, price};

        state.value.options = {
          ...feeExtend,
          [id]: option
        }
      }
      else {
        delete feeExtend[id];
        state.value.options = feeExtend;
      }

      this.setState({feeExtend});
      !!this.props.setStatePrice &&  this.props.setStatePrice(state);
    }
  }

  componentDidUpdate(){
    let { price, feeHouseExtend, feeExtend } = this.state;
    let { feeAssetHouse } = this.props;
    
    if(!!feeExtend && isEmpty(feeExtend)){
      if(!!this.props.setStatePrice) {
        let stateRuleExtends = { key   : "_assetHouseValue", value: {name: "Lựa chọn thêm", options: {}} };
        this.props.setStatePrice(stateRuleExtends);
      } 
      this.setState({feeExtend: null})
    }
    
    if(!!price && !!feeAssetHouse && !isEmpty(feeAssetHouse.ordered) && feeHouseExtend === null){
      let state = { key   : "_assetHouseValue", value: { name: "Phí bảo hiểm tài sản nhà", options: {}}};

      let tem         = {};
      let priceArray  = [];
      
      for(let i in feeAssetHouse.data){
        let item = feeAssetHouse.data[i];
        if(!!item && item.price >= price) {
          tem[item.price] = i
          priceArray.push(parseFloat(item.price))
        }
      }

      let pri = Math.min(...priceArray)

      if(!!pri){
        let key = tem[pri];
        let feeAsset        = !!feeAssetHouse.data[key] && !!feeAssetHouse.data[key] ? feeAssetHouse.data[key] : null;
        let feeHouseState   = !!feeAsset && !!feeAsset.fee ? feeAsset.fee : 0;
        let feeHouseExtend  = !!feeAsset && !!feeAsset.feeExtends ? feeAsset.feeExtends : null;

        feeHouseState = parseFloat(feeHouseState);
        
        
        let { feeExtend } = this.state;
        feeExtend  = !!feeExtend ? feeExtend : {};
        let option = {name: 'Phí', price: feeHouseState};
        
        feeExtend.feeID = option;
        state.value.options = {
          ...feeExtend
        }

        this.setState({feeExtend, price, feeHouseExtend});
        !!this.props.setStatePrice &&  this.props.setStatePrice(state); 

      }

    }

  }

  render() {
    
    let { t, feeNameExtendHouse, feeAssetHouse, dataRequest, disabled } = this.props;
    let { feeHouseExtend, feeExtend } = this.state;
    
    if (feeNameExtendHouse.isWorking || feeAssetHouse.isWorking) return <Loading />
  
    return (
      <React.Fragment>

        <div className={`col-xs-12`}>
          <label>{t('product:house_form_houseValue')}</label>
          <input 
            disabled    = { disabled }
            defaultValue={ !!dataRequest && !!dataRequest.detail.assetHouseValue ? _ftNumber.format(dataRequest.detail.assetHouseValue, 'number') : "" }
            id          = "assetHouseValue" 
            ref         = { e => this._assetHouseValue = e }
            onChange    = { this.assetHouseValueChange }
            className   = "form-control" />
        </div>

        {
          !!feeNameExtendHouse && !!feeNameExtendHouse.ordered && feeNameExtendHouse.ordered.map(e => {
            let item = feeNameExtendHouse.data[e];
            let key = `assetHouse${e}`;
            
            if(!item || !!item.removed || !feeHouseExtend || !feeHouseExtend[e]) return null;
    
            let checked = !!feeExtend && feeExtend[e] ? true : false;
            let price = !!feeHouseExtend[e] ? parseFloat(feeHouseExtend[e]) : 0;
            
            return (
              <div key={key} className="col-md-12">
                <div className="checkbox checkbox-info pull-left col-md-12 m-t-15">
                  <input 
                    disabled        = { disabled }
                    defaultChecked  = { checked }
                    id      = { key }
                    onClick = { this.ruleExtendsClick({key, id: e, price: feeHouseExtend[e], name: item.name}) }
                    ref     = { el => this._feeNameExtend[key] = el } type="checkbox" />
                  <label htmlFor={key} > {item.name ? item.name : ""} ({formatPrice(price, "VNĐ", 1)}) </label>
                </div>
              </div>
            )
          })
        }

      </React.Fragment>
        
    );
  }
}

let mapStateToProps = (state) => {
  let { profile } = state;
  let { feeAssetHouse, feeNameExtendHouse } = state.categories;
  return { feeAssetHouse, profile, feeNameExtendHouse };
};

let mapDispatchToProps = (dispatch) => {
  return {
    feeAssetHouseActions      : bindActionCreators(feeAssetHouseActions, dispatch),
    feeNameExtendHouseActions : bindActionCreators(feeNameExtendHouseActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PriceFastHouse);