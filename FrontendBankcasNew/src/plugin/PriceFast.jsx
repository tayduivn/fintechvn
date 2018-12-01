import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select, Loading } from 'components';


import { actions as yearsActions } from 'modules/categories/years';
import { actions as seatsPayloadActions } from 'modules/categories/seatsPayload';
import { actions as ruleExtendsActions } from 'modules/categories/ruleExtends';

import { isEmpty } from 'utils/functions';
import _ftNumber from 'utils/number';
import { formatPrice } from 'utils/format';

class PriceFast extends React.Component {
  _ruleExtends      = {};
  _ruleExtendsInit  = {};

  constructor(props){
    super(props);
    this.state = {
      yearId        : null,
      careType      : null,
      ruleExtends   : null,
      cYear         : 0
    }
  }

  componentDidMount(){
    let { years, yearsActions, profile, seatsPayload, seatsPayloadActions,
      ruleExtendsActions, dataRequest } = this.props;
    
    let where = {insur_id: profile.info.agency.insur_id, removed: 0};

    if(years.ordered.length === 0) yearsActions.fetchAll({}, 0, 0, where);

    if(seatsPayload.ordered.length === 0) seatsPayloadActions.fetchAll({}, 0, 0, where);

    ruleExtendsActions.fetchAll({}, 0, 0, where)
      .then(r => {
        if(!!r){
          let state = { key   : "_getRuleExtends", value: {name: "Lựa chọn thêm", options: {}} };
          let options = {};
          for(let val of r){
            options[val.id] = {};
          }
          
          this._ruleExtendsInit = {...options};

          let stateLo = {ruleExtends: options};

          if(!!dataRequest){
            let { listInfo } = dataRequest.detail;
            let { _getYearCar, _getCareType, _getRuleExtends } = listInfo;
            
            options = { ...options, ..._getRuleExtends.options};
            stateLo = {
              yearId        : _getYearCar.value,
              careType      : _getCareType.value,
              ruleExtends   : options,
              cYear         : _getYearCar.text
            }
          }

          this.setState({...stateLo});
          state.value.options = options;

          !!this.props.setStatePrice &&  this.props.setStatePrice(state);
        }
      });

    let rules = [
      {id: "sumcar", rule: "int:0"},
      {id: "yearcar", rule: "base:^[\\d]{4}$"},
      {id: "loaixe", rule: "int:0:1"},
      {id: "seatspayload", rule: "str:24:24"},
    ]

    
    !!this.props.setRules && this.props.setRules(rules)
  }

  carValueChange = () => {
    if(!!this._carValue){
      _ftNumber.listener(this._carValue, {maxLength: 12});
      let price = _ftNumber.parse(_ftNumber.value(this._carValue));
      let state = { key   : "_getPriceCar", value: null};
      if(price > 0 && price <= 999999999999){
        state = {
          key   : "_getPriceCar",
          value : {name: "Giá trị nhà", lang: 'motor_form_carValue', text: formatPrice(price, ' VNĐ') , value: price}
        }
      }
      this.setState({ruleExtends: {}});
      !!this.props.setStatePrice &&  this.props.setStatePrice(state);
    }
  }

  carYearChange = () => {
    if(!!this._carYear){
      _ftNumber.listener(this._carYear, {struct: 'year'});
      let year = _ftNumber.parse(_ftNumber.value(this._carYear));
      let yearCurrent = new Date().getFullYear();
      let rexYear = /^\d{4}$/;
      let id = null;
      let state = { key   : "_getCareType", value: null};
      let cYear = 0;

      if(rexYear.test(year) && year <= yearCurrent){
        cYear = yearCurrent - year;
        let { years } = this.props;

        for(let key in years.data){
          let { min, max } = years.data[key];
          if(cYear >= min && cYear < max){
            id = key;
            break;
          }
        }
        state = {
          key   : "_getYearCar",
          value : {name: "Số năm xe", lang: 'motor_form_sumYear', text: cYear, value: id}
        }
        
      }
      
      this.setState({yearId: id, cYear, ruleExtends: {}});
      this._carSeat.selectedIndex = 0;
      !!this.props.setStatePrice &&  this.props.setStatePrice(state);
    }
  }

  selectCarTypeChange = () => {
    let { t } = this.props;

    if(!!this._selectCarType){
      let type = !!this._selectCarType ? this._selectCarType.value : null;
      let state = { key   : "_getCareType", value: null};
      type = (type === "null") ? null : type;

      if(!!type){
        type = parseInt(type, 10);

        let text = !!type ? 'motor_carBussiness' : 'motor_carPersonal';

        state = {
          key   : "_getCareType",
          value : {name: "Loại xe", lang: 'motor_form_carType', text: t(`product:${text}`), value: type}
        }
       
      }
      
      this.setState({careType: type, ruleExtends: {}});
      this._carSeat.selectedIndex = 0;
      !!this.props.setStatePrice &&  this.props.setStatePrice(state);
      
    }
  }

  seatspayloadChange = () => {
    let { seatsPayload } = this.props;

    if(!!this._carSeat){
      let value = !!this._carSeat ? this._carSeat.value : "";
      let rexYear = /^\w{24}$/;
      let ratio = 0;
      let text = '';
      let state = { key   : "_getSeatsPayload", value: null};

      if(rexYear.test(value)){

        let name = this._carSeat.options[this._carSeat.selectedIndex].text;

        for(let id in seatsPayload.data){
          let seat = seatsPayload.data[id];
          if(!!seat && id === value) {
            text = `${seat.ratio}%`;
            ratio = seat.ratio;
          }
        }

        state = { 
          key: "_getSeatsPayload", 
          value : {name, text, value, ratio} };
      }
      this.setState({ruleExtends: {}})
      !!this.props.setStatePrice &&  this.props.setStatePrice(state);
    }
  }

  ruleExtends = (e) => () => {
    let { ruleExtends, stateLocal } = this.props;
    let { cYear } = this.state;

    let checked = !!this._ruleExtends && !!this._ruleExtends[e] ? this._ruleExtends[e].checked : false;
    let state = { key   : "_getRuleExtends", value: {name: "Lựa chọn thêm", options: {}} };
    let options = !!this.state.ruleExtends ? this.state.ruleExtends : {...this._ruleExtendsInit};

    let { price } = stateLocal;
    price = !!price ? price : 0;

    let valueCar = !!this._carValue ? this._carValue.value : "0";
    valueCar = _ftNumber.parse(valueCar);

    if(!!checked){
      let item = ruleExtends.data[e];
      
      if(!!item){
        let name = `${item.code} (${item.ratio}%)`;
        let fee = (cYear >= item.minYear)
          ? (!!item.type ? (price * item.ratio / 100) : (valueCar * item.ratio / 100) )
          : 0;
          
        let option = {name, ratio:  item.ratio, type: item.type, fee};
        
        options[e] = option
        state.value.options = options;

        options = { ...options, [e]: option }
      }
    }else{
      options[e] = {};
      state.value.options = options
    }

    this.setState({ruleExtends: options})
    !!this.props.setStatePrice &&  this.props.setStatePrice(state);
    
  }

  componentDidUpdate(){
    let { ruleExtends } = this.state;
    
    if(!!ruleExtends && isEmpty(ruleExtends)){
      let state = { key   : "_getRuleExtends", value: {name: "Lựa chọn thêm", options: {...this._ruleExtendsInit} } };
      
      this.setState({ruleExtends: {...this._ruleExtendsInit} });
      !!this.props.setStatePrice &&  this.props.setStatePrice(state);
    }
  }

  render() {
    let { dataRequest, disabled, t, seatsPayload, ruleExtends } = this.props;
    let { yearId, careType, ruleExtends: ruleExtendsState } = this.state;

    ruleExtendsState = !!ruleExtendsState ? ruleExtendsState : {};
   
    let dataError = {};
    let seatsPayloadOption = []; //!!dataRequest ? [] : [{text: t('product:moto_selectSeatPayLoad'), value: null}];

    if(!!yearId && undefined !== careType){
      for(let id in seatsPayload.data){
        let seat = seatsPayload.data[id];
        if(!!seat && seat.year_id === yearId && seat.type === careType){
          seatsPayloadOption.push({text: seat.name, value: id})
        }
      }
    }

    if(!!dataRequest && isEmpty(seatsPayloadOption)) return <Loading />;

    seatsPayloadOption = [
      {text: t('product:moto_selectSeatPayLoad'), value: null},
      ...seatsPayloadOption
    ]

    return (
      <React.Fragment>

        <div className={`col-xs-6 ${!!dataError.cityId ? 'has-error' : ''}`}>
          <label>{t('product:motor_form_carValue')}</label>
          <input disabled={disabled} defaultValue={!!dataRequest ? dataRequest.detail.sumcar : ""} id="sumcar" ref={e => this._carValue = e} onChange={ this.carValueChange } className="form-control" />
        </div>

        <div className={`col-xs-6 ${!!dataError.cityId ? 'has-error' : ''}`}>
          <label>{t('product:motor_form_carYear')}</label>
          <input  disabled={disabled} defaultValue={!!dataRequest ? dataRequest.detail.yearcar : ""} id="yearcar" ref={e => this._carYear = e} onChange={ this.carYearChange } className="form-control" />
        </div>

        <div className={`col-xs-6 m-t-15 ${!!dataError.cityId ? 'has-error' : ''}`}>
          <label>{t('product:motor_form_carType')}</label>
          <select  disabled={disabled} defaultValue={!!dataRequest ? dataRequest.detail.loaixe : ""} id="loaixe" ref={e => this._selectCarType = e} onChange={ this.selectCarTypeChange } className="form-control">
            <option value="null">{t('product:motor_selectCarType')}</option>
            <option value="1">{t('product:motor_carBussiness')}</option>
            <option value="0">{t('product:motor_carPersonal')}</option>
          </select>
        </div>

        <div className={`col-xs-6 m-t-15 ${!!dataError.cityId ? 'has-error' : ''}`}>
          <label>{t('product:motor_form_carSeat')}</label>
          <Select
            id            = "seatspayload"
            disabled      = {disabled}
            defaultValue  = {!!dataRequest ? dataRequest.detail.seatspayload : ""}
            onChange  = { this.seatspayloadChange }
            refHTML   = { e => this._carSeat = e }
            options   = { seatsPayloadOption } />
        </div>

        {
          !!ruleExtends.ordered && !isEmpty(ruleExtends.ordered) && ruleExtends.ordered.map(e => {
            let item = ruleExtends.data[e];
            if(!item) return null;
            
            let checked = !!ruleExtendsState[e] && !isEmpty(ruleExtendsState[e]) ? true: false;

            return (
              <div key={e} className="col-md-12">
                <div className="checkbox checkbox-info pull-left col-md-12 m-t-15">
                  <input disabled={disabled} checked={ checked } id={e} onChange={ this.ruleExtends(e) } ref = { el => this._ruleExtends[e] = el } type="checkbox" />
                  <label htmlFor={e} > {item.code ? item.code : ""} - {item.name ? item.name : ""} </label>
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
  let { years, seatsPayload, ruleExtends } = state.categories;
  return { years, profile, seatsPayload, ruleExtends };
};

let mapDispatchToProps = (dispatch) => {
  return {
    yearsActions          : bindActionCreators(yearsActions, dispatch),
    seatsPayloadActions   : bindActionCreators(seatsPayloadActions, dispatch),
    ruleExtendsActions    : bindActionCreators(ruleExtendsActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PriceFast);