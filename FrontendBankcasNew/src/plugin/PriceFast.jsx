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
  _ruleExtends = {};

  constructor(props){
    super(props);
    this.state = {
      yearId        : null,
      careType      : null,
      ruleExtends  : {}
    }
  }

  componentDidMount(){
    let { years, yearsActions, profile, seatsPayload, seatsPayloadActions,
      ruleExtends, ruleExtendsActions, dataRequest } = this.props;
    
    if(years.ordered.length === 0) yearsActions.fetchAll({}, 0, 0, {
        insur_id: profile.info.agency.insur_id,
        removed: 0
      });

    if(seatsPayload.ordered.length === 0) seatsPayloadActions.fetchAll({}, 0, 0, {
        insur_id: profile.info.agency.insur_id,
        removed: 0
      });

    if(ruleExtends.ordered.length === 0) ruleExtendsActions.fetchAll({}, 0, 0, {
        insur_id: profile.info.agency.insur_id,
        removed: 0
      });

    let rules = [
      {id: "sumcar", rule: "int:0"},
      {id: "yearcar", rule: "base:^[\\d]{4}$"},
      {id: "loaixe", rule: "int:0:1"},
      {id: "seatspayload", rule: "str:24:24"},
    ]

    if(!!dataRequest){
      let { listInfo } = dataRequest.detail;
      let { _getYearCar, _getCareType, _getRuleExtends } = listInfo;

      this.setState({
        yearId        : _getYearCar.value,
        careType      : _getCareType.value,
        ruleExtends   : _getRuleExtends.options
      })
    }
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
      !!this.props.setStatePrice &&  this.props.setStatePrice(state)
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

      if(rexYear.test(year) && year <= yearCurrent){
        let cYear = yearCurrent - year;
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

      this.setState({yearId: id});
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

      this.setState({careType: type});
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

      !!this.props.setStatePrice &&  this.props.setStatePrice(state);
    }
  }

  ruleExtends = (e) => () => {
    let { ruleExtends } = this.props;

    let checked = !!this._ruleExtends && !!this._ruleExtends[e] ? this._ruleExtends[e].checked : false;
    let state = { key   : "_getRuleExtends", value: {name: "Lựa chọn thêm", options: {}} };
    let options = this.state.ruleExtends;

    if(!!checked){
      let item = ruleExtends.data[e];
      if(!!item){
        let option = {name: item.name, ratio:  item.ratio, type: item.type};
        state.value.options = {
          ...options,
          [e]: option
        }

        options = { ...options, [e]: option }
      }
    }else{
      delete options[e];
      state.value.options = options
    }

    this.setState({ruleExtends: options})
    !!this.props.setStatePrice &&  this.props.setStatePrice(state);
    
  }

  render() {
    let { dataRequest, disabled, t, seatsPayload, ruleExtends } = this.props;
    let { yearId, careType, ruleExtends: ruleExtendsState } = this.state;

   
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
          <input disabled={disabled} defaultValue={!!dataRequest ? dataRequest.detail.yearcar : ""} id="yearcar" ref={e => this._carYear = e} onChange={ this.carYearChange } className="form-control" />
        </div>

        <div className={`col-xs-6 m-t-15 ${!!dataError.cityId ? 'has-error' : ''}`}>
          <label>{t('product:motor_form_carType')}</label>
          <select disabled={disabled} defaultValue={!!dataRequest ? dataRequest.detail.loaixe : ""} id="loaixe" ref={e => this._selectCarType = e} onChange={ this.selectCarTypeChange } className="form-control">
            <option value="null">{t('product:motor_selectCarType')}</option>
            <option value="1">{t('product:motor_carBussiness')}</option>
            <option value="0">{t('product:motor_carPersonal')}</option>
          </select>
        </div>

        <div className={`col-xs-6 m-t-15 ${!!dataError.cityId ? 'has-error' : ''}`}>
          <label>{t('product:motor_form_carSeat')}</label>
          <Select
            id="seatspayload"
            disabled={disabled}
            defaultValue={!!dataRequest ? dataRequest.detail.seatspayload : ""}
            onChange  = { this.seatspayloadChange }
            refHTML   = { e => this._carSeat = e }
            options   = { seatsPayloadOption } />
        </div>

        {
          !!ruleExtends.ordered && !isEmpty(ruleExtends.ordered) && ruleExtends.ordered.map(e => {
            return (
              <div key={e} className="col-md-12">
                <div className="checkbox checkbox-info pull-left col-md-12 m-t-15">
                  <input disabled={disabled} defaultChecked={!!ruleExtendsState[e] ? true: false} id={e} onClick={ this.ruleExtends(e) } ref = { el => this._ruleExtends[e] = el } type="checkbox" />
                  <label htmlFor={e} > {ruleExtends.data[e].name ? ruleExtends.data[e].name : ""} </label>
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