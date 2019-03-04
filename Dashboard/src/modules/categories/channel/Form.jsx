import React, { Component, Fragment } from 'react';

import { validateForm, validate } from 'utils/validate';
import Switch from "react-switch";

class FormAdd extends Component {
  _nameInput          = null;
  _pathInput          = null;
  _channelTypeSelect  = null;
  _statusSelect       = null;
  _formData           = null;
  
  constructor(props){
    super(props);
    this.state = {
      channelID   : null,
      agencyID    : null,
      userEditID  : null,
      isInsur     : false,
      channelType : 0
    }
  }
  

  onSubmitData = (e) => {
    e.preventDefault();
    let { channelType, isInsur } = this.state;

    let valid = validateForm(this._formData,
      [
        {id: 'name', rule: 'str:3:200'},
        {id: 'path', rule: 'domain:3:200'},
        {id: 'channel_type', rule: 'int:0:1'}
      ]
    );

    if(valid && !!this._statusSelect) valid = validate(this._statusSelect, 'int:0:1');
    
    if(valid){
      let name            = (this._nameInput != null) ? this._nameInput.value : null;
      let path            = (this._pathInput != null) ? this._pathInput.value : null;
      let channel_type    = (this._channelTypeSelect != null) ? this._channelTypeSelect.value : null;
      
      let data = {
        name, path, channel_type
      }

      if(!!this._statusSelect) data.status = this._statusSelect.value;
      if(!!channelType) data.isInsur = isInsur;
      
      if(!!this.props.formSubmitData) this.props.formSubmitData(data);
    }
  }

  channelTypeChange = (value) => {
    let channelType = 1;
    if(!!validate(this._channelTypeSelect, 'int:0:1')) channelType = parseInt(this._channelTypeSelect.value, 10);
    this.setState({channelType})
  }

  componentDidMount(){
    let { dataGroup }     = this.props;
    if(!!dataGroup){
      let { channel_type, isInsur }  = dataGroup;
      channel_type          = parseInt(channel_type, 10);
      this.setState({channelType: channel_type, isInsur});
    }
  }

  render() {
    let { dataGroup } = this.props;
    let { isInsur, channelType }   = this.state;
    
    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Name</label>
            <input defaultValue={ dataGroup ? dataGroup.name : "" } className={`form-control`} name="name" id="name" ref={e => this._nameInput = e} />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Link channel</label>
            <input defaultValue={ dataGroup ? dataGroup.path : "" } className={`form-control`} name="path" id="path" ref={e => this._pathInput = e} />

          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Channel type</label>
            <select
              onChange      = { this.channelTypeChange }
              defaultValue  = { dataGroup ? dataGroup.channel_type : ""} 
              className     = "form-control" id="channel_type" ref={e => this._channelTypeSelect = e}>
              
              <option>-- Select channel type</option>
              <option value="0">Dashboard</option>
              <option value="1">Channel</option>
            </select>
          </div>
        </div>
        {
          (!!channelType)
          ? (
            <Fragment>
              <div className="form-group">
                <div className="col-xs-12">
                  <label style={{display: 'flex'}}>
                    <span className="m-r-15">Is that insurcance channel</span>
                    <Switch
                      className       = "react-switch"
                      onChange        = { isInsur => this.setState({isInsur}) }
                      checked         = { isInsur }
                      height          = { 20 }
                      width           = { 40 }
                      aria-labelledby = "neat-label"
                    />
                  </label>
                </div>
              </div>

              <div className="form-group">
                <div className="col-xs-12">
                  <label>Status</label>
                  <select defaultValue={dataGroup ? dataGroup.status : ""} className="form-control" id="status" ref={e => this._statusSelect = e}>
                    <option>-- Select status</option>
                    <option value="0">Close</option>
                    <option value="1">Open</option>
                  </select>
                </div>
              </div>
            </Fragment>
            
          )
          : null
        }
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
