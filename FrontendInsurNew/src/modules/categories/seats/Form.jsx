import React, { Component } from 'react';

import { validateForm } from 'utils/validate';
import _ftNumber from 'utils/number';

class FormAdd extends Component {
  _nameInput          = null;
  _formData           = null;
  _feeInput           = null;
  _vatInput           = null;

  onSubmitData = (e) => {
    e.preventDefault();
    let rule = [
      {id: 'name', rule: "str:3:250"},
      {id: 'fee', rule: "num:1"},
      {id: 'vat', rule: "int:1:100"},
    ];

    if(validateForm(this._formData, rule)){
      let name = !!this._nameInput ? this._nameInput.value : "";
      let fee = !!this._feeInput ? this._feeInput.value : "";
      let vat = !!this._vatInput ? this._vatInput.value : "";

      fee = undefined !== fee && fee !== "" ? _ftNumber.parse(fee) : 0;
      vat = undefined !== vat && vat !== "" ? _ftNumber.parse(vat) : 10;

      let data = { name, fee, vat };
      if(!!this.props.formSubmitData) this.props.formSubmitData(data);
    }
  }

  componentDidMount(){
    if(!!this._feeInput) _ftNumber.listener(this._feeInput, {maxLength: 12})
  }

  render() {
    let { dataGroup } = this.props;

    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Name</label>
            <input id="name" defaultValue={!!dataGroup ? dataGroup.name : ""} ref={e => this._nameInput = e} className="form-control" />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Fee</label>
            <input id="fee" defaultValue={!!dataGroup ? _ftNumber.format(dataGroup.fee, 'number') : ""} ref={e => this._feeInput = e} className="form-control" />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>VAT(%)</label>
            <input id="vat" defaultValue={!!dataGroup ? dataGroup.vat : "10"} ref={e => this._vatInput = e} className="form-control" />
          </div>
        </div>

        <div className="form-actions m-t-30">
          <button type="submit" className="btn btn-flat btn-outline btn-info"><i className="fa fa-check"></i> Save</button>
          <button onClick={this.props.onClose} type="button" className="right-side-toggle btn-flat btn-outline btn btn-danger m-l-15">Cancel</button>
          <div className="clear"></div>
        </div>

      </form>
    );
  }
}


export default FormAdd;