import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select, Loading } from 'components';


import { actions as yearsActions } from 'modules/categories/years';
import { actions as seatsActions } from 'modules/categories/seats';
import { actions as ruleExtendsActions } from 'modules/categories/ruleExtends';
import { actions as carTypeActions } from 'modules/categories/carType';

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

  componentWillReceiveProps(pro){ 
    let { ruleExtends, dataRequest } = pro
    if(!ruleExtends.isWorking && !this.state.ruleExtends){
      let state = { key   : "_getRuleExtends", value: {name: "Lựa chọn thêm", options: {}} };
      let options = {};
      let r = Object.values(ruleExtends.data);

      for(let val of r)  options[val.id] = {};
      
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
  }
  
  componentWillMount(){ 
    let { years, yearsActions, profile, seats, seatsActions,
      ruleExtendsActions, carTypeActions, carType } = this.props;
    
    let where = {insur_id: profile.info.agency.insur_id, removed: 0};

    if(years.ordered.length === 0) yearsActions.fetchAll({}, 0, 0, where);

    if(seats.ordered.length === 0) seatsActions.fetchAll({}, 0, 0, where);
    if(carType.ordered.length === 0) carTypeActions.fetchAll({}, 0, 0, where);

    ruleExtendsActions.fetchAll({}, 0, 0, where)
      .then(r => { 
        // if(!!r){
        //   let state = { key   : "_getRuleExtends", value: {name: "Lựa chọn thêm", options: {}} };
        //   let options = {};
        //   for(let val of r)  options[val.id] = {};
          
        //   this._ruleExtendsInit = {...options};

        //   let stateLo = {ruleExtends: options};

        //   if(!!dataRequest){
        //     let { listInfo } = dataRequest.detail;
        //     let { _getYearCar, _getCareType, _getRuleExtends } = listInfo;
            
        //     options = { ...options, ..._getRuleExtends.options};
        //     stateLo = {
        //       yearId        : _getYearCar.value,
        //       careType      : _getCareType.value,
        //       ruleExtends   : options,
        //       cYear         : _getYearCar.text
        //     }
        //   }
        //   this.setState({...stateLo});
        //   state.value.options = options;

        //   !!this.props.setStatePrice &&  this.props.setStatePrice(state);
        // }
      });

    let rules = [
      {id: "sumcar", rule: "int:0"},
      {id: "yearcar", rule: "base:^[\\d]{4}$"},
      {id: "carType", rule: "str:24:24"},
      {id: "seats", rule: "str:24:24"},
    ]

    !!this.props.setRules && this.props.setRules(rules);
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
    let { carType } = this.props;

    if(!!this._selectCarType){
      let id = !!this._selectCarType ? this._selectCarType.value : null;
      let state = { key   : "_getCareType", value: null};

      if(new RegExp('^[\\w]{24}$').test(id)){
        let item = carType.data[id];
        
        if(!!item){
          state = {
            key   : "_getCareType",
            value : {name: "Loại xe", text: item.name, value: id, tnds: item.tnds}
          }
        }
       
      }
      
      this.setState({careType: id, ruleExtends: {}});
      this._carSeat.selectedIndex = 0;
      !!this.props.setStatePrice &&  this.props.setStatePrice(state);
      
    }
  }

  seatspayloadChange = () => {
    let { carType } = this.props;

    if(!!this._carSeat){
      let value = !!this._carSeat ? this._carSeat.value : "";
      let rexYear = /^\w{24}$/;
      let ratio = 0;
      let text = '';
      let state = { key   : "_getSeatsPayload", value: null};

      if(rexYear.test(value)){

        let name = this._carSeat.options[this._carSeat.selectedIndex].text;
        let { yearId, careType } = this.state;

        if(!!yearId && undefined !== careType){
          let dataCarType = carType.data[careType];
          if(!!dataCarType){
    
            let { listSeat } = dataCarType.seatPayloads[yearId];
            if(!!listSeat){
              ratio = listSeat[value];
              if(undefined !== ratio){
                ratio = +ratio;
                text = `${ratio}%`;
              }
            }
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
        let { countType, code, ratio, type, content } = item;
        countType = parseInt(countType, 10);
        
        let name = `${code}`;
        if(!countType) name += ` (${_ftNumber.format(item.price, 'number')}VND)`;
        else name += ` (${ratio}%)`;

        let fee = 0;

        if(cYear >= item.minYear){
          fee = item.price;
          if(!!countType)
            fee = (!!type ? (price * ratio / 100) : (valueCar * ratio / 100) );
        }
        let option = {name, ratio, type, fee, text: item.name, countType, price: item.price, content};
        
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

  componentDidUpdate(prvPro, prvState){
    let { ruleExtends, careType } = this.state;
    
    if(!!ruleExtends && isEmpty(ruleExtends)){
      let state = { key   : "_getRuleExtends", value: {name: "Lựa chọn thêm", options: {...this._ruleExtendsInit} } };
      this.setState({ruleExtends: {...this._ruleExtendsInit} });
      !!this.props.setStatePrice &&  this.props.setStatePrice(state);
    }

    
    if(!!prvState.careType && !!careType && prvState.careType !== careType){ 
      let state = { key   : "_getSeatsPayload", value: null};
      !!this.props.setStatePrice &&  this.props.setStatePrice(state);
    }
  }

  render() {
    let { dataRequest, disabled, t, seats, ruleExtends, years, carType } = this.props;
    let { yearId, careType, ruleExtends: ruleExtendsState } = this.state;
    
    if(seats.isWorking || years.isWorking || carType.isWorking || ruleExtends.isWorking) return <Loading />;
    
    ruleExtendsState = !!ruleExtendsState ? ruleExtendsState : {};
   
    let dataError = {};
    let seatsPayloadOption = !!dataRequest ? [] : [{text: t('product:moto_selectSeatPayLoad'), value: null}];
    
    if(!!yearId && undefined !== careType){
      let dataCarType = carType.data[careType];
      if(!!dataCarType){

        let { listSeat } = !!dataCarType.seatPayloads && !!dataCarType.seatPayloads[yearId] ?  dataCarType.seatPayloads[yearId]: {};
        listSeat = !!listSeat ? listSeat : {};

        if(!!listSeat){
          for(let id in listSeat){
            let item = seats.data[id];
            if(!!item) seatsPayloadOption.push({text: item.name, value: id})
          }
          if(!this._didMount) this._didMount = true;
        }
      }

      if(!!dataRequest) seatsPayloadOption = [
        {text: t('product:moto_selectSeatPayLoad'), value: null},
        ...seatsPayloadOption
      ];
      
    }
    
    if(!!this._didMount && isEmpty(seatsPayloadOption)) seatsPayloadOption.push({text: t('product:moto_selectSeatPayLoad'), value: null});
    
    if( seats.isWorking || ruleExtends.isWorking || carType.isWorking ||
      (!!dataRequest && isEmpty(seatsPayloadOption)) ) return <Loading />;

    let optionCarType = [{text: "-- Select car type", value: 0}];
    carType.ordered.forEach( e => {
      if(carType.data[e].removed === 0){
        let { name } = carType.data[e];

        optionCarType.push({text: name, value: e})
      }
    });

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

          <Select
            id            = "carType"
            disabled      = {disabled}
            defaultValue  = {!!dataRequest ? dataRequest.detail.carType : ""}
            onChange  = { this.selectCarTypeChange }
            refHTML   = { e => this._selectCarType = e }
            options   = { optionCarType } />

        </div>

        <div className={`col-xs-6 m-t-15 ${!!dataError.cityId ? 'has-error' : ''}`}>
          <label>{t('product:motor_form_carSeat')}</label>
          <Select
            id            = "seats"
            disabled      = {disabled}
            defaultValue  = {!!dataRequest ? dataRequest.detail.seats : ""}
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
  let { years, seats, ruleExtends, carType } = state.categories;
  return { years, profile, seats, ruleExtends, carType };
};

let mapDispatchToProps = (dispatch) => {
  return {
    yearsActions          : bindActionCreators(yearsActions, dispatch),
    seatsActions   : bindActionCreators(seatsActions, dispatch),
    ruleExtendsActions    : bindActionCreators(ruleExtendsActions, dispatch),
    carTypeActions        : bindActionCreators(carTypeActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PriceFast);