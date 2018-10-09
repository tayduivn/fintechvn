import React, { Component } from 'react';

import { validateForm } from 'utils/validate';

class FormAdd extends Component {
  _nameInput          = null;
  _codeInput          = null;
  _ratioInput         = null;
  _typeSelect         = null;
  _formData           = null;

  onSubmitData = (e) => {
    e.preventDefault();

    let valid = validateForm(this._formData,
      [
        {id: 'name', rule: 'str:3:200'},
        {id: 'code', rule: 'str:1:10'},
        {id: 'ratio', rule: 'num:0:100'},
        {id: 'type', rule: 'int:0:1'},
      ]
    );

    if(valid){
      let name      = (!!this._nameInput) ? this._nameInput.value : null;
      let code      = (!!this._codeInput) ? this._codeInput.value : null;
      let ratio     = (!!this._ratioInput) ? this._ratioInput.value : null;
      let type      = (!!this._typeSelect) ? this._typeSelect.value : null;

      let data = { name, ratio, type, code };

      if(!!this.props.formSubmitData) this.props.formSubmitData(data);
    }

  }

  render() {
    let { dataGroup } = this.props;

    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Name</label>
            <input defaultValue={ dataGroup ? dataGroup.name : "" } ref={ e => this._nameInput = e} id="name" className="form-control" />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Code</label>
            <input defaultValue={ dataGroup ? dataGroup.code : "" } ref={ e => this._codeInput = e} id="code" className="form-control" />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Ratio</label>
            <input defaultValue={ dataGroup ? dataGroup.ratio : 0 } ref={ e => this._ratioInput = e} id="ratio" className="form-control" />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Type</label>
            <select defaultValue={ dataGroup ? dataGroup.type : "" } ref={ e => this._typeSelect = e} id="type" className="form-control">
              <option>-- Select type</option>
              <option value="0">Car fee</option>
              <option value="1" >Insurance fees</option>
            </select>
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