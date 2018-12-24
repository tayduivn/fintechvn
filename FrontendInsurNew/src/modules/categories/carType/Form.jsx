import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { validate, validateForm } from 'utils/validate';
import { Select } from 'components';
import { isEmpty } from 'utils/functions';
import _ftNumber from 'utils/number';

class FormAdd extends Component {
  _nameInput          = null;
  _formData           = null;
  _selectYear         = {};
  _feeExtends         = {};
  _seatPayloads       = {};
  _feeHouse           = {};
  _tndsCheckBox       = {};
  _tndsRatio          = {};
  _validForm          = {
    priceHouse: { id: 'name', rule: 'str:3:250' }
  };

  constructor(props){
    super(props);
    this.state = {
      seatPayloads: {},
      optionYear: [],
      tnds      : {}
    }
  }

  componentWillMount(){
    let { dataDefault } = this.props;
    if(!!dataDefault){
      let { seatPayloads, optionYear, tnds } = this.state;
      
      if(!!dataDefault.seatPayloads){
        Object.keys(dataDefault.seatPayloads).forEach((e, i) => {
          seatPayloads[i] = { [e]: dataDefault.seatPayloads[e] } ;
        })

        optionYear = [...Object.keys(dataDefault.seatPayloads)];
      }

      if(!!dataDefault.tnds) tnds = dataDefault.tnds


      this.setState({seatPayloads, optionYear, tnds })
      
    }
  }

  onSubmitData = (e) => {
    e.preventDefault();

    let { notification } = this.props;
    
    if(validateForm(this._formData, Object.values(this._validForm))){
      let name = !!this._nameInput ? this._nameInput.value : 0;
      let { seatPayloads, tnds } = this.state;
      let listSeat = {};

      for(let id in seatPayloads){
        let i = Object.keys(seatPayloads[id])[0]
        listSeat[i] = seatPayloads[id][i]
      }

      let fl = true;

      for(let j in listSeat){
        if(!listSeat[j].listSeat || isEmpty(listSeat[j].listSeat)){
          fl = false;
          break;
        }
      }
      
      if(!!fl){
        let data = {
          name,
          seatPayloads: listSeat,
          tnds
        }
        !!this.props.formSubmit && this.props.formSubmit(data)
      } else notification.e("Error", "Data invalid");
    }
  }

  selectYearChane = (st) => () => {
    let select = this._selectYear[st];
    let yearH = !!select ? select.value : "";
    let { seatPayloads, optionYear } = this.state;
    let stt  = parseInt(select.getAttribute('stt'), 10)
    stt  = stt > 0 ?  stt : 0;

    if(new RegExp('^\\w{24}$').test(yearH)){
      if(+stt >= 0){
        let id = !!seatPayloads[stt] ? Object.keys(seatPayloads[stt])[0] : null;
        seatPayloads = {
          ...seatPayloads,
          [stt]: {
            [yearH] : { listSeat: {} }
          }
        }
        optionYear = optionYear.filter(e => e !== id);
        optionYear.push(yearH)
      }
    }else{
      if(!!seatPayloads[stt]){
        let id = Object.keys(seatPayloads[stt])[0];
        optionYear = optionYear.filter(e => e !== id)
      }
      delete seatPayloads[stt];

    };

    this.setState({seatPayloads, optionYear});
    
  }

  feeExtendsClick = ({st, id}) => () => {
    let selector = !!this._feeExtends[st] && !!this._feeExtends[st][id] ? this._feeExtends[st][id] : null;
    
    if(!!selector){
      let fl = selector.checked;
      let { seatPayloads } = this.state;
      if(!!seatPayloads[st]){
        let key = Object.keys(seatPayloads[st])[0];
        let listSeat = !!seatPayloads[st][key] && !!seatPayloads[st][key].listSeat ? seatPayloads[st][key].listSeat : {};
        
        if(!!fl) listSeat[id]  = 0;
        else delete listSeat[id];

        seatPayloads[st][key].listSeat = listSeat;

        this.setState({seatPayloads});
      }
    }
  }

  seatPayloadsChange = ({st, id}) => () => {
    let selector = !!this._seatPayloads[st] && !!this._seatPayloads[st][id] ? this._seatPayloads[st][id] : null;
    if(!!selector){
      let { seatPayloads } = this.state;
      
      if(validate(selector, 'num:0:100')){
        let { seatPayloads } = this.state;
        if(!!seatPayloads[st]){
          let key = Object.keys(seatPayloads[st])[0];
          let listSeat = !!seatPayloads[st][key].listSeat ? seatPayloads[st][key].listSeat : {};

          if(undefined !== listSeat[id]) listSeat[id] = selector.value;
          seatPayloads[st][key].listSeat = listSeat;
        }
        
      }
      this.setState({seatPayloads});
    }
  }

  tndsCheckBoxChange = ({id, item}) => () => {
    let checked = !!this._tndsCheckBox[id] ? this._tndsCheckBox[id].checked : false;
    let tnds = { ...this.state.tnds };

    if (!!this._tndsRatio[id]) _ftNumber.listener(this._tndsRatio[id], { maxLength: 4 });

    if(!!checked) tnds[id] = 1
    else delete tnds[id];
    this.setState({tnds});
  }

  tndsRatioInputChange = ({id}) => () => {
    let selected = this._tndsRatio[id];

    if(!!selected){ 
      if(validate(selected, 'num:1:100')){
        let ratio = this._tndsRatio[id].value;
        ratio = _ftNumber.parse(ratio);

        let tnds = { ...this.state.tnds };
        tnds[id] = ratio;
        this.setState({tnds});
      }
    }
  }

  render() {
    let { years, seats, dataDefault } = this.props;
    let { seatPayloads, optionYear, tnds } = this.state;
    let optionYears = [];
    for(let id in years.data){
      let item = years.data[id];
      if(!!item && !item.removed) {
        let text = `From ${item.min} to under ${item.max} year`;
        optionYears.push({text, value: id })
      }
    }

    optionYears = [ {text: "Select year house", value: "null"}, ...optionYears ];
  
    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal">
        <button className="btn-flat btn btn-success pull-right">
          <i className={`${!!dataDefault ? 'ti-check' : 'fa fa-plus'} m-r-5`} />
          {
            !!dataDefault ? "Update" : "Create"
          }
        </button>
        <Link to="/categories/car-type" className="btn-flat btn btn-info m-r-15 pull-left">
          <i className="ti-arrow-left m-r-5" />
          Back to list
        </Link>
        
        <div className="clear"></div>
        <hr style={{marginTop: '10px', marginBottom: "10px"}}/>
        <div className="form-group">
          <div className="col-xs-12">
            <label className="col-xs-2 control-label strong">Name</label>
            <div className="col-xs-10">
              <input defaultValue={!!dataDefault ? dataDefault.name : "" } id="name" ref={e => this._nameInput = e} className="form-control" />
            </div>
          </div>

          <div className="col-xs-12">
            <label className="col-xs-2 control-label strong">TNDS</label>
            <div className="col-xs-10">
            {
                                      
              !!seats && seats.ordered.map(id => {
                let item = seats.data[id];
                if (!item || !!item.removed ) return null;
                let fee = item.fee + item.fee * item.vat / 100 ;
                let key = `tnds-${id}`;

                let disabled = !tnds[id] ? { disabled: true } : {};

                return (
                  <div key={key} className="input-group m-t-15 feeHouse">
                    <div style={{padding: "5px"}} className="input-group-addon br-0 no-bg">
                      <div className="checkbox checkbox-info pull-left p-t-0">
                        <input
                          onChange={ this.tndsCheckBoxChange({id, item})}
                          id={ key } 
                          ref={el => this._tndsCheckBox[id] = el} 
                          defaultChecked={ !!tnds[id] ? true : false }  type="checkbox" />
                        <label htmlFor={ key }></label>
                      </div>
                    </div>
                    <div className="text-feeHouse input-group-addon br-0 no-bg">
                      <p className="m-0">{item.name} ({_ftNumber.format(fee, 'number')} VND)</p>
                    </div>
                    <input
                      { ...disabled }
                      value         = { !!tnds[id] ? tnds[id] : "" }
                      ref           = { el => this._tndsRatio[id] = el }
                      onChange      = { this.tndsRatioInputChange({id}) }
                      className     = "form-control"
                      placeholder   = "Price" /> 
                  </div>
                )
              })
            }
            </div>
          </div>

        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label className="col-xs-2 control-label strong">Year</label>
            <div className="col-xs-10">
              {
                [...Array(Object.keys(seatPayloads).length + 1)].map((i, st) => {
                  this._feeExtends[st] = {};
                  this._seatPayloads[st]  = {};
                  let key = `yearHoue-${st}`;
                  let rule = {id: key, rule: ''};
                  rule.rule = st === 0 ? 'base:(^\\w{24}$)' : 'base:(^\\w{24}$)?';
                  this._validForm[key] = rule;

                  let keyYear = !!seatPayloads[st] ? Object.keys(seatPayloads[st])[0] : "";
                  // console.log(keyYear)
                  return (
                    <Fragment key={st}>
                      <Select
                        stt       = {st}
                        id        = {`yearHoue-${st}`}
                        refHTML   = { e => this._selectYear[st] = e}
                        onChange  = { this.selectYearChane(st) }
                        value     = { keyYear }
                        options   = { 
                          optionYears.filter(e => {
                            if( e.value === "null") return e;
                            if(optionYear.indexOf(e.value) === -1) return e;
                            if(!!seatPayloads[st] && !!seatPayloads[st][e.value]) return e;
                            return null;
                          }) } />
                      {
                        Object.keys(seatPayloads).map(e => {
                          if(!!seatPayloads[e] && +st === +e){
                            return (
                              <Fragment key={e}>
                                <div className="m-t-15 m-b-15">
                                  <label className="col-xs-2 control-label strong">Ratio</label>
                                  <div className="col-xs-10 p-r-0">
                                    {
                                      
                                      !!seats && seats.ordered.map(id => {
                                        let item = seats.data[id];
                                        let k = Object.keys(seatPayloads[st])[0];

                                        let disabled = 
                                          !k || !seatPayloads[st][k] || !seatPayloads[st][k].listSeat || undefined === seatPayloads[st][k].listSeat[id]
                                          ? {disabled: 'disabled'} : {};
                                        let key = `seatPayloads-${st}-${id}`;

                                        if(!item || !!item.removed || !tnds[id]){
                                          delete this._validForm[key];
                                          return null;
                                        };
                                        
                                        let rule = {id: key, rule: 'num:0:100'};

                                        if(isEmpty(disabled))  rule.rule = 'num:0.1:100';
                                        this._validForm[key] = rule;

                                        let checked = false;

                                        if(!!seatPayloads[st] && !!seatPayloads[st][keyYear] && !!seatPayloads[st][keyYear].listSeat){
                                          if(Object.keys(seatPayloads[st][keyYear].listSeat).indexOf(id) !== -1) checked = true
                                        }

                                        return (
                                          <div key={id} className="input-group m-t-15 feeHouse">
                                            <div style={{padding: "5px"}} className="input-group-addon br-0 no-bg">
                                              <div className="checkbox checkbox-info pull-left p-t-0">
                                                <input defaultChecked={ checked } onClick={ this.feeExtendsClick({st, id}) } ref={e => this._feeExtends[st][id] = e} id={`${e}-${id}`} type="checkbox" />
                                                <label htmlFor={`${e}-${id}`}></label>
                                              </div>
                                            </div>
                                            <div className="text-feeHouse input-group-addon br-0 no-bg">
                                              <p className="m-0">{item.name}</p>
                                            </div>
                                            <input 
                                              value     = { !!k && !!seatPayloads[st][k].listSeat && !!seatPayloads[st][k].listSeat[id] ? seatPayloads[st][k].listSeat[id] : "0" }
                                              onChange  = { this.seatPayloadsChange({st, id}) }
                                              ref       = {e => this._seatPayloads[st][id] = e}
                                              {...disabled} type="text"
                                              className="form-control"
                                              id = { key }
                                              placeholder="Price" /> 
                                          </div>
                                        )
                                      })
                                    }
                                  </div>
                                  <div className="clear"></div>
                                </div>
                              </Fragment>
                              
                            )
                          }
                          return null;
                        })
                      }
                    </Fragment>
                  )
                })
              }
              
            </div>
          </div>
        </div>

      </form>
    );
  }
}


export default FormAdd;