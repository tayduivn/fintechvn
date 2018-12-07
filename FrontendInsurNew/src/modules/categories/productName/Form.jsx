import React, { Component } from 'react';

import { validate } from 'utils/validate';

class FormAdd extends Component {
  _nameInput          = null;
  _formData           = null;

  onSubmitData = (e) => {
    e.preventDefault();
    
    if(validate(this._nameInput, "str:3:250")){
      let name = !!this._nameInput ? this._nameInput.value : "";
      name = name.trim();
      if(!!this.props.formSubmitData) this.props.formSubmitData({name});
    }
  }

  render() {
    let { dataGroup } = this.props;

    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Name</label>
            <input defaultValue={!!dataGroup ? dataGroup.name : ""} ref={e => this._nameInput = e} className="form-control" />
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