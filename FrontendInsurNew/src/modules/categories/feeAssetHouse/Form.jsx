import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { validateForm } from 'utils/validate';
import { isEmpty } from 'utils/functions';
import  _ftNumber  from 'utils/number';

class FormAdd extends Component {
  _priceHouseInput    = null;
  _formData           = null;
  _feeInput           = null;
  _feeExtends         = {};
  _feeHouseExtend     = {};
  _feeHouse           = {};
  _validForm          = {
    priceHouse: { id: 'priceHouse', rule: 'num:1' },
    fee: { id: 'fee', rule: 'num:1' },
  };

  constructor(props){
    super(props);
    this.state = {
      feeExtends: {}
    }
  }

  componentWillMount(){
    let { datafeeAssetHouse } = this.props;
    if(!!datafeeAssetHouse){
      let { feeExtends } = datafeeAssetHouse;
      !!feeExtends && this.setState({feeExtends})
    }
  }

  componentDidMount(){
    !!this._priceHouseInput && _ftNumber.listener(this._priceHouseInput, {maxLength: 12});
    !!this._feeInput && _ftNumber.listener(this._feeInput, {maxLength: 12});
  }

  onSubmitData = (e) => {
    e.preventDefault();
    
    if(validateForm(this._formData, Object.values(this._validForm))){
      let price = !!this._priceHouseInput ? this._priceHouseInput.value : 0;
      price = price.replace(/,/g, '');

      let fee   = !!this._feeInput ? this._feeInput.value : 0;
      fee = fee.replace(/,/g, '');

      let { feeExtends } = this.state;

      let data = {
        price,
        fee,
        feeExtends: feeExtends
      }
      !!this.props.formSubmit && this.props.formSubmit(data);
    }
  }

  feeExtendsClick = ({id}) => () => {
    let selector =  !!this._feeExtends[id] ? this._feeExtends[id] : null;
   
    if(!!selector){
      let fl = selector.checked;
      let { feeExtends } = this.state;
      if(!!feeExtends){
        
        if(!!fl) feeExtends[id]  = 0;
        else delete feeExtends[id];

        this.setState({feeExtends});
      }
    }
  }

  feeHouseExtendChange = ({id}) => () => {
    let selector =  !!this._feeHouseExtend[id] ? this._feeHouseExtend[id] : null;

    if(!!selector){
      _ftNumber.listener(selector, {maxLength: 12});
      let fee = _ftNumber.parse(_ftNumber.value(selector));
      if(!!fee){
        let { feeExtends } = this.state;
        feeExtends[id] = !!feeExtends[id] ? feeExtends[id] : 0;
        feeExtends[id] = fee;
        this.setState({feeExtends});
      }
    }
  }

  render() {
    let { feeNameExtendHouse, datafeeAssetHouse } = this.props;
    let { feeExtends } = this.state;
    
    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal">
        <button className="btn-flat btn btn-success pull-right">
          <i className={`${!!datafeeAssetHouse ? 'ti-check' : 'fa fa-plus'} m-r-5`} />
          {
            !!datafeeAssetHouse ? "Update" : "Create"
          }
        </button>
        <Link to="/categories/fee-asset-house" className="btn-flat btn btn-info m-r-15 pull-left">
          <i className="ti-arrow-left m-r-5" />
          Back to list
        </Link>
        
        <div className="clear"></div>
        <hr style={{marginTop: '10px', marginBottom: "10px"}}/>
        <div className="form-group">
          <div className="col-xs-6">
            <label className="col-xs-3 control-label strong">Price asset house</label>
            <div className="col-xs-9">
              <input 
                defaultValue={!!datafeeAssetHouse ? _ftNumber.format(datafeeAssetHouse.price, 'number') : "" } 
                id="priceHouse" ref={e => this._priceHouseInput = e} className="form-control" />
            </div>
          </div>
          <div className="col-xs-6">
            <label className="col-xs-3 control-label strong">Fee</label>
            <div className="col-xs-9">
              <input 
                defaultValue={!!datafeeAssetHouse ? _ftNumber.format(datafeeAssetHouse.fee, 'number') : "" } 
                id="fee" ref={e => this._feeInput = e} className="form-control" />
            </div>
          </div>
        </div>
        <div className="form-group">
            <label className="col-xs-2 control-label strong">Fee asset extend house</label>
            <div className="col-xs-9">
            {
              !!feeNameExtendHouse && feeNameExtendHouse.ordered.map(id => {
                let item = feeNameExtendHouse.data[id];
                if(!item && !item.removed) return null;
                let disabled = !feeExtends || undefined === feeExtends[id] ? { disabled: true } : {};

                let key = `feeEx-${id}`;
                
                if(isEmpty(disabled))  {
                  let rule = {id: key, rule: 'num:1'};
                  this._validForm[key] = rule;
                }else delete this._validForm[key]
                  
        
                let checked = !!feeExtends && undefined !== feeExtends[id] ? true : false;
                let val = !!feeExtends && undefined !== feeExtends[id] ? feeExtends[id] : "";
                val = _ftNumber.format(val, 'number');

                return (
                  <div key={id} className="input-group m-t-15 feeHouse">
                    <div style={{padding: "5px"}} className="input-group-addon br-0 no-bg">
                      <div className="checkbox checkbox-info pull-left p-t-0">
                        <input 
                          defaultChecked={ checked }
                          onClick= { this.feeExtendsClick({id})}
                          ref={e => this._feeExtends[id] = e} id={id} type="checkbox" />
                        <label htmlFor={id}></label>
                      </div>
                    </div>
                    <div className="text-feeHouse input-group-addon br-0 no-bg">
                      <p className="m-0">{item.name}</p>
                    </div>
                    <input 
                      value     = { val }
                      onChange  = { this.feeHouseExtendChange({id}) }
                      ref       = {e => this._feeHouseExtend[id] = e}
                      {...disabled} type="text"
                      className="form-control"
                      id = { key }
                      placeholder="Price" /> 
                  </div>
                )
              })
            }
            </div>
          
        </div>

      </form>
    );
  }
}


export default FormAdd;