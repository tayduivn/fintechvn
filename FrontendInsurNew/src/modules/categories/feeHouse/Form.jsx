import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { validate, validateForm } from 'utils/validate';
import { Select } from 'components';
import { isEmpty } from 'utils/functions';

class FormAdd extends Component {
  _nameInput          = null;
  _formData           = null;
  _selectYear         = {};
  _feeExtends         = {};
  _feeHouseExtend     = {};
  _feeHouse           = {};
  _validForm          = {
    priceHouse: { id: 'priceHouse', rule: 'num:1' }
  };

  constructor(props){
    super(props);
    this.state = {
      feeExtends: {},
      optionYear: []
    }
  }

  componentWillMount(){
    let { dataFeeHouse } = this.props;
    if(!!dataFeeHouse){
      let { feeExtends, optionYear } = this.state;
      
      if(!!dataFeeHouse.feeExtends){
        Object.keys(dataFeeHouse.feeExtends).forEach((e, i) => {
          feeExtends[i] = { [e]: dataFeeHouse.feeExtends[e] } ;
        })

        optionYear = [...Object.keys(dataFeeHouse.feeExtends)];

        this.setState({feeExtends, optionYear})
      }
      
    }
  }

  onSubmitData = (e) => {
    e.preventDefault();

    let { notification } = this.props;

    if(validateForm(this._formData, Object.values(this._validForm))){
      let priceHouse = !!this._nameInput ? this._nameInput.value : 0;
      let { feeExtends } = this.state;
      let feeExtend = {};

      for(let id in feeExtends){
        let i = Object.keys(feeExtends[id])[0]
        feeExtend[i] = feeExtends[id][i]
      }

      let fl = true;

      for(let j in feeExtend){
        if(!feeExtend[j].feeExtend || isEmpty(feeExtend[j].feeExtend)){
          fl = false;
          break;
        }
      }

      if(!!fl){
        let data = {
          price: priceHouse,
          feeExtends: feeExtend
        }

        !!this.props.formSubmit && this.props.formSubmit(data)
      } else notification.e("Error", "Data invalid");
    }
  }

  selectYearChane = (st) => () => {
    let select = this._selectYear[st];
    let yearH = !!select ? select.value : "";
    let { feeExtends, optionYear } = this.state;
    let stt  = parseInt(select.getAttribute('stt'), 10)
    stt  = stt > 0 ?  stt : 0;

    if(new RegExp('^\\w{24}$').test(yearH)){
      if(+stt >= 0){
        let id = !!feeExtends[stt] ? Object.keys(feeExtends[stt])[0] : null;
        feeExtends = {
          ...feeExtends,
          [stt]: {
            [yearH] : { feeExtend: {} }
          }
        }
        optionYear = optionYear.filter(e => e !== id);
        optionYear.push(yearH)
      }
    }else{
      if(!!feeExtends[stt]){
        let id = Object.keys(feeExtends[stt])[0];
        optionYear = optionYear.filter(e => e !== id)
      }
      delete feeExtends[stt];

    };

    this.setState({feeExtends, optionYear});
    
  }

  feeExtendsClick = ({st, id}) => () => {
    let selector = !!this._feeExtends[st] && !!this._feeExtends[st][id] ? this._feeExtends[st][id] : null;
    
    if(!!selector){
      let fl = selector.checked;
      let { feeExtends } = this.state;
      if(!!feeExtends[st]){
        let key = Object.keys(feeExtends[st])[0];
        let feeExtend = !!feeExtends[st][key] && !!feeExtends[st][key].feeExtend ? feeExtends[st][key].feeExtend : {};
        
        if(!!fl) feeExtend[id]  = 0;
        else delete feeExtend[id];

        feeExtends[st][key].feeExtend = feeExtend;

        this.setState({feeExtends});
      }
    }
  }

  feeHouseExtendChange = ({st, id}) => () => {
    let selector = !!this._feeHouseExtend[st] && !!this._feeHouseExtend[st][id] ? this._feeHouseExtend[st][id] : null;
    if(!!selector){
      let { feeExtends } = this.state;
      
      if(validate(selector, 'num:1')){
        let { feeExtends } = this.state;
        if(!!feeExtends[st]){
          let key = Object.keys(feeExtends[st])[0];
          let feeExtend = !!feeExtends[st][key].feeExtend ? feeExtends[st][key].feeExtend : {};

          if(undefined !== feeExtend[id]) feeExtend[id] = selector.value;
          feeExtends[st][key].feeExtend = feeExtend;
        }
        
      }
      this.setState({feeExtends});
    }
  }

  feeHouseChange = ({st}) => () => {
    let selector = !!this._feeHouse[st] && !!this._feeHouse[st] ? this._feeHouse[st] : null;

    if(!!selector){
      if(validate(selector, 'num:1')){
        let { feeExtends } = this.state;

        if(!!feeExtends[st]){
          let key = Object.keys(feeExtends[st])[0];
          let fee = !!feeExtends[st][key].fee ? feeExtends[st][key].fee : 0;
          fee =  selector.value;
          feeExtends[st][key].fee = fee;
        }
        this.setState({feeExtends});
      }
    }
  }

  render() {
    let { yearHouse, feeNameExtendHouse, dataFeeHouse } = this.props;
    let { feeExtends, optionYear } = this.state;
    let optionYears = [];

    for(let id in yearHouse.data){
      let item = yearHouse.data[id];
      if(!!item) {
        let text = `From ${item.min} to under ${item.max} year`;
        optionYears.push({text, value: id })
      }
    }

    optionYears = [
      {text: "Select year house", value: "null"},
      ...optionYears
    ];
  
    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal">
        <button className="btn-flat btn btn-success pull-right">
          <i className={`${!!dataFeeHouse ? 'ti-check' : 'fa fa-plus'} m-r-5`} />
          {
            !!dataFeeHouse ? "Update" : "Create"
          }
        </button>
        <Link to="/categories/fee-house" className="btn-flat btn btn-info m-r-15 pull-left">
          <i className="ti-arrow-left m-r-5" />
          Back to list
        </Link>
        
        <div className="clear"></div>
        <hr style={{marginTop: '10px', marginBottom: "10px"}}/>
        <div className="form-group">
          <div className="col-xs-12">
            <label className="col-xs-2 control-label strong">Price house</label>
            <div className="col-xs-10">
              <input defaultValue={!!dataFeeHouse ? dataFeeHouse.price : "" } id="priceHouse" ref={e => this._nameInput = e} className="form-control" />
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label className="col-xs-2 control-label strong">Year</label>
            <div className="col-xs-10">
              {
                [...Array(Object.keys(feeExtends).length + 1)].map((i, st) => {
                  this._feeExtends[st] = {};
                  this._feeHouseExtend[st]  = {};
                  let key = `yearHoue-${st}`;
                  let rule = {id: key, rule: ''};
                  rule.rule = st === 0 ? 'base:(^\\w{24}$)' : 'base:(^\\w{24}$)?';
                  this._validForm[key] = rule;

                  let keyYear = !!feeExtends[st] ? Object.keys(feeExtends[st])[0] : "";

                  return (
                    <Fragment key={st}>
                      <Select
                        stt       = {st}
                        id        = {`yearHoue-${st}`}
                        refHTML   = { e => this._selectYear[st] = e}
                        onChange  = { this.selectYearChane(st) }
                        defaultValue = { keyYear }
                        options   = { 
                          optionYears.filter(e => {
                            if( e.value === "null") return e;
                            if(optionYear.indexOf(e.value) === -1) return e;
                            if(!!feeExtends[st] && !!feeExtends[st][e.value]) return e;
                            return false;
                          }) } />
                      {
                        Object.keys(feeExtends).map(e => {
                          if(!!feeExtends[e] && +st === +e){
                            let key = `fee-${st}`;
                            let rule = {id: key, rule: 'num:1'};
                            this._validForm[key] = rule;
                            
                            let defaulFee = !!feeExtends[e][keyYear] && !!feeExtends[e][keyYear].fee ? feeExtends[e][keyYear].fee : 0;

                            return (
                              <Fragment key={e}>
                                <div className="m-t-15 m-b-15">
                                  <label className="col-xs-2 control-label strong">Fee insurance</label>
                                  <div className="col-xs-10 p-r-0">
                                    <input
                                      defaultValue  = { defaulFee }
                                      id            = { key }
                                      onChange      = { this.feeHouseChange({st}) }
                                      ref           = { e => this._feeHouse[st] = e}
                                      className     = "form-control" />
                                  </div>
                                  <div className="clear"></div>
                                </div>

                                <div className="m-t-15 m-b-15">
                                  <label className="col-xs-2 control-label strong">Fee extends</label>
                                  <div className="col-xs-10 p-r-0">
                                    {
                                      
                                      !!feeNameExtendHouse && feeNameExtendHouse.ordered.map(id => {
                                        let item = feeNameExtendHouse.data[id];
                                        let k = Object.keys(feeExtends[st])[0];

                                        let disabled = 
                                          !k || !feeExtends[st][k] || !feeExtends[st][k].feeExtend || undefined === feeExtends[st][k].feeExtend[id]
                                          ? {disabled: 'disabled'} : {};

                                        let key = `feeExtends-${st}-${id}`;
                                        let rule = {id: key, rule: 'num:0'};

                                        if(isEmpty(disabled))  rule.rule = 'num:1';
                                        this._validForm[key] = rule;

                                        if(!item) return null;
                                        
                                        let checked = false;

                                        if(!!feeExtends[st] && !!feeExtends[st][keyYear] && !!feeExtends[st][keyYear].feeExtend){
                                          if(Object.keys(feeExtends[st][keyYear].feeExtend).indexOf(id) !== -1) checked = true
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
                                              value     = { !!k && !!feeExtends[st][k].feeExtend && !!feeExtends[st][k].feeExtend[id] ? feeExtends[st][k].feeExtend[id] : 0 }
                                              onChange  = { this.feeHouseExtendChange({st, id}) }
                                              ref       = {e => this._feeHouseExtend[st][id] = e}
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