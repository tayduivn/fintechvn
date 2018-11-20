import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Loading } from 'components';


import { actions as feeHouseActions } from 'modules/categories/feeHouse';
import { actions as feeNameExtendHouseActions } from 'modules/categories/feeNameExtendHouse';
import { actions as yearHouseActions } from 'modules/categories/yearHouse';

import { isEmpty } from 'utils/functions';
import _ftNumber from 'utils/number';
import { formatPrice } from 'utils/format';

class FeeAssetHouse extends React.Component {
  _houseValue         = null;
  _yearHouseValue     = null;
  _feeNameExtend      = {};
  _feeAssetNameExtend = null;

  constructor(props){
    super(props);
    this.state = {
      yearId          : null,
      price           : 0,
      feeHouseExtend  : null,
      feeExtend       : null
    }
  }
  componentDidMount(){
    let { profile, feeHouse, feeNameExtendHouse, yearHouse,
      feeHouseActions, feeNameExtendHouseActions, yearHouseActions, dataRequest } = this.props;

    let where = {insur_id: profile.info.agency.insur_id, removed: 0};

    if(feeHouse.ordered.length === 0) feeHouseActions.fetchAll({}, 0, 0, where);
    if(feeNameExtendHouse.ordered.length === 0) feeNameExtendHouseActions.fetchAll({}, 0, 0, where);
    if(yearHouse.ordered.length === 0) yearHouseActions.fetchAll({}, 0, 0, where);

    let rules = [
      {id: "houseValue", rule: "num:1"},
      {id: "yearHouseValue", rule: "base:^[\\d]{4}$"}
    ];

    if(!!dataRequest && !!dataRequest.detail && !!dataRequest.detail.listInfo){
      let { _getRuleExtends, _getRangeYear, _houseValue } = dataRequest.detail.listInfo;

      let yearId = !!_getRangeYear && !!_getRangeYear.value ? _getRangeYear.value : null;
      let price = !!_houseValue && !!_houseValue.value ? _houseValue.value : null;
      let feeExtend = !!_getRuleExtends && !!_getRuleExtends.options ? _getRuleExtends.options : null
      this.setState({yearId, price, feeExtend});
    }
    

    !!this.props.setRules && this.props.setRules(rules);


  }

  houseValueChange = () => {
    if(!!this._houseValue){
      _ftNumber.listener(this._houseValue, {maxLength: 12});
      let price = _ftNumber.parse(_ftNumber.value(this._houseValue));
      let state = { key   : "_houseValue", value: null};

      if(price > 0 && price <= 999999999999){
        state = {
          key   : "_houseValue",
          value : {name: "Giá trị xe", lang: 'house_form_houseValue', text: formatPrice(price, ' VNĐ') , value: price}
        }
      } else price = null;
      this.setState({price, feeHouseExtend: null, feeExtend: {}});
      if(!!this.props.setStatePrice) {
        this.props.setStatePrice(state);
      }  
    }
  }

  ruleExtends = ({id, price, name}) => () => {
    let selector = !!this._feeNameExtend[id] ? this._feeNameExtend[id] : null;
    let { feeExtend } = this.state;
    feeExtend = !!feeExtend ? feeExtend : {};
    let state = { key   : "_getRuleExtends", value: {name: "Lựa chọn thêm", options: {}} };

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

  yearHouseValueChange = () => {
    if(!!this._yearHouseValue){
      _ftNumber.listener(this._yearHouseValue, {struct: 'year'});
      let year = _ftNumber.parse(_ftNumber.value(this._yearHouseValue));
      let yearCurrent = new Date().getFullYear();
      let rexYear = /^\d{4}$/;
      let id = null;
      let state = { key   : "_getRangeYear", value: null};

      if(rexYear.test(year) && year <= yearCurrent){
        let cYear = yearCurrent - year;
        let { yearHouse } = this.props;

        for(let key in yearHouse.data){
          let { min, max } = yearHouse.data[key];
          if(cYear >= min && cYear < max){
            id = key;
            break;
          }
        }
        state = {
          key   : "_getRangeYear",
          value : {name: "Số năm xe", lang: 'house_form_sumYear', text: cYear, value: id}
        }
      }

      this.setState({yearId: id, feeHouseExtend: null, feeExtend: {}});
      if(!!this.props.setStatePrice) {
        this.props.setStatePrice(state);
      }  
     
    }
  }

  componentDidUpdate(){
    let { yearId, price, feeHouseExtend, feeExtend } = this.state;
    let { feeHouse } = this.props;

    if(!!feeExtend && isEmpty(feeExtend)){
      if(!!this.props.setStatePrice) {
        let stateRuleExtends = { key   : "_getRuleExtends", value: {name: "Lựa chọn thêm", options: {}} };
        this.props.setStatePrice(stateRuleExtends);
      } 
      this.setState({feeExtend: null})
    }

    if(!!yearId && !!price && !!feeHouse && feeHouseExtend === null){
      
      let tem         = {};
      let priceArray  = [];

      for(let i in feeHouse.data){
        let item = feeHouse.data[i];
        if(!!item && item.price >= price) {
          tem[item.price] = i
          priceArray.push(parseFloat(item.price))
        }
      }

      let pri = Math.min(...priceArray)

      if(!!pri){
        let key = tem[pri];
        feeHouseExtend        = !!feeHouse.data[key] && !!feeHouse.data[key].feeExtends[yearId] ? feeHouse.data[key].feeExtends[yearId] : null;
        let feeHouseState     = !!feeHouseExtend && !!feeHouseExtend.fee ? feeHouseExtend.fee : 0;

        feeHouseState = parseFloat(feeHouseState);
        let state = { key   : "price", value: feeHouseState };

        !!this.props.setStateLocal && this.props.setStateLocal(state)

        !!feeHouseExtend  && this.setState({feeHouseExtend});
      }

    }

  }

  render() {
    
    let { t, feeNameExtendHouse, feeHouse, yearHouse, dataRequest, disabled } = this.props;
    let { feeHouseExtend, feeExtend } = this.state;

    if (feeNameExtendHouse.isWorking || feeHouse.isWorking || yearHouse.isWorking) return <Loading />

    return (
      <React.Fragment>

        <div className={`col-xs-6`}>
          <label>{t('product:house_form_houseValue')}</label>
          <input 
            disabled    = { disabled }
            defaultValue={ !!dataRequest ? dataRequest.detail.houseValue : "" }
            id          = "houseValue" 
            ref         = { e => this._houseValue = e }
            onChange    = { this.houseValueChange }
            className   = "form-control" />
        </div>

        <div className={`col-xs-6`}>
          <label>{ t('product:house_form_yearHouseValue') }</label>
          <input
            disabled      = { disabled }
            defaultValue  = {!!dataRequest ? dataRequest.detail.yearHouseValue : ""}
            id            = "yearHouseValue"
            ref           = { e => this._yearHouseValue = e}
            onChange      = { this.yearHouseValueChange }
            className     = "form-control" />
        </div>

        {
          !!feeNameExtendHouse && !!feeNameExtendHouse.ordered && feeNameExtendHouse.ordered.map(e => {
            let item = feeNameExtendHouse.data[e];
            
            if(!item || !!item.removed || !feeHouseExtend || !feeHouseExtend.feeExtend || !feeHouseExtend.feeExtend[e]) return null;
    
            let checked = !!feeExtend && feeExtend[e] ? true : false;
            let price = !!feeHouseExtend.feeExtend[e] ? parseFloat(feeHouseExtend.feeExtend[e]) : 0;
            
            return (
              <div key={e} className="col-md-12">
                <div className="checkbox checkbox-info pull-left col-md-12 m-t-15">
                  <input 
                    disabled        = { disabled }
                    defaultChecked  = { checked }
                    id      = { e }
                    onClick = { this.ruleExtends({id: e, price: feeHouseExtend.feeExtend[e], name: item.name}) }
                    ref     = { el => this._feeNameExtend[e] = el } type="checkbox" />
                  <label htmlFor = { e } > {item.name ? item.name : ""} ({formatPrice(price, "VNĐ", 1)}) </label>
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
  let { feeHouse, feeNameExtendHouse, yearHouse } = state.categories;
  return { feeHouse, profile, feeNameExtendHouse, yearHouse };
};

let mapDispatchToProps = (dispatch) => {
  return {
    feeHouseActions           : bindActionCreators(feeHouseActions, dispatch),
    feeNameExtendHouseActions : bindActionCreators(feeNameExtendHouseActions, dispatch),
    yearHouseActions          : bindActionCreators(yearHouseActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FeeAssetHouse);