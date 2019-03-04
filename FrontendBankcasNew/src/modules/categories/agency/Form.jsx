import React, { Component } from 'react';

import { validateForm, validate } from 'utils/validate';
import { Select } from 'components';

class FormAdd extends Component {
  _nameInput          = null;
  _maxUserInput       = null;
  _channelSelect      = null;
  _formData           = null;
  
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
        {id: 'name', rule: 'str:3:200'},
        {id: 'max_user', rule: 'int:1:9999'}
      ]
    );

    if(valid && !!this._channelSelect) valid = validate(this._channelSelect, 'str:24:24');

    if(valid){
      let name            = (this._nameInput != null) ? this._nameInput.value : null;
      let max_user        = (this._maxUserInput != null) ? this._maxUserInput.value : null;
      
      let data = {
        name, max_user
      }

      if(!!this._channelSelect){
        let channel_id  = (this._channelSelect != null) ? this._channelSelect.value : null;
        data.channel_id = channel_id;
      }
      
      if(!!this.props.formSubmitData) this.props.formSubmitData(data);
    }
  }

  agencyChange = (value) => {
    this.setState({agencyID: value});
  }

  channelChange = (value) => {
    this.setState({channelID: value});
  }

  renderChannelSelect  = () => {
    let { dataGroup, channel } = this.props;

    if(!!dataGroup && dataGroup.channel && dataGroup.channel.channel_type === 0) return null;
    
    let optionChannel = [{text: "-- Select Channel", value: 0}];
    channel.ordered.forEach( e => {
      if(channel.data[e].channel_type !== 0)
        optionChannel.push({text: channel.data[e].name, value: e})
    });

    return (
      <div className="form-group">
        <div className="col-xs-12">
          <label>Channel</label>
          <Select
            id="channel_id"
            refHTML={e => this._channelSelect = e}
            defaultValue = { (dataGroup && dataGroup.channel.id ? dataGroup.channel.id : null)}
            options = {optionChannel}/>
        </div>
      </div>
    );
  }

  render() {
    let { dataGroup, channel } = this.props;

    let optionChannel = [{text: "-- Select Channel", value: 0}];
    channel.ordered.forEach( e => {
      if(channel.data[e].channel_type !== 0)
        optionChannel.push({text: channel.data[e].name, value: e})
    });

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
            <label>Max user</label>
            <input defaultValue={ dataGroup ? dataGroup.max_user : "" } className={`form-control`} name="max_user" id="max_user" ref={e => this._maxUserInput = e} />

          </div>
        </div>

        { this.renderChannelSelect() }

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
