import React, { Component } from 'react';

import { validateForm } from 'utils/validate';

class FormAdd extends Component {
  _nameInput     = null;
  _formData      = null;
  
  constructor(props){
    super(props);
    this.state = {
      channelID   : null,
      agencyID    : null,
      userEditID  : null
    }
  }
  

  onSubmitData = (e) => {
    e.preventDefault();

    let valid = validateForm(this._formData,
      [
        {id: 'name', rule: 'str:3:200'}
      ]
    );
    
    if(valid){
      let name       = (this._nameInput != null) ? this._nameInput.value : null;

      if(name){
        if(!!this.props.formSubmitData) this.props.formSubmitData({name});
      }
    }
  }

  agencyChange = (value) => {
    this.setState({agencyID: value});
  }

  channelChange = (value) => {
    this.setState({channelID: value});
  }

  render() {
    let { dataGroup } = this.props;
    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Name</label>
            <input defaultValue={ dataGroup ? dataGroup.name : "" } className={`form-control`} name="name" id="name" ref={e => this._nameInput = e} />
            <span className="help-block">Email invalid or 7 - 100 characters</span>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-flat btn-outline btn-info"><i className="fa fa-check"></i> Save</button>
          <button onClick={this.props.onClose} type="button" className="right-side-toggle btn-flat btn-outline btn btn-danger m-l-15">Cancel</button>
          <div className="clear"></div>
        </div>

      </form>
    );
  }
}


export default FormAdd;