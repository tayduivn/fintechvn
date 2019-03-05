import React, { Component, Fragment } from 'react';

import { validateForm, validate } from 'utils/validate';
import { Select } from 'components';
import Switch from "react-switch";

class FormAdd extends Component {
  _nameInput          = null;
  _maxUserInput       = null;
  _channelSelect      = null;
  _formData           = null;
  
  constructor(props){
    super(props);
    this.state = {
      channelID   : 0,
      agencyID    : 0,
      userEditID  : null,
      status      : true
    }
  }
  

  onSubmitData = (e) => {
    e.preventDefault();
    let { status } = this.state;
    let valid = validateForm(this._formData,
      [
        {id: 'key', rule: 'str:3:200'},
        {id: 'insur_id', rule: 'str:24:24'},
        {id: 'channel_id', rule: 'str:24:24'},
      ]
    );
    
    if(valid){
      let key             = (this._keyInput != null) ? this._keyInput.value : null;
      let channel_id      = (this._channelSelect != null) ? this._channelSelect.value : "";
      let agency_id        = (this._insurSelect != null) ? this._insurSelect.value : "";
      
      let data = {
        key,
        agency_id,
        channel_id,
        status
      }
      
      if(!!this.props.formSubmitData) this.props.formSubmitData(data);
    }
  }

  channelChange = (value) => {
    let valid       = validate(this._channelSelect, 'str:24:24');

    let channelID   = 0;
    
    if(!!valid) channelID     = this._channelSelect.value;

    this.setState({channelID});
  }

  agencyChange = (value) => {
    let valid       = validate(this._insurSelect, 'str:24:24');

    let agencyID   = 0;
    
    if(!!valid) agencyID     = this._insurSelect.value;

    this.setState({agencyID});
  }

  renderChannelSelect  = () => {
    let { dataGroup, channel, agency, apiKey }  = this.props;
    let { channelID, agencyID }                 = this.state;

    let agency_id;
    if(!!dataGroup) agency_id   = dataGroup.agency_id;
    
    let arrAgencyID   = [];
    for(let item of Object.values(apiKey.data)){
      arrAgencyID.push(item.agency_id);
    }
    
    if(!!dataGroup && dataGroup.channel && dataGroup.channel.channel_type === 0) return null;
    
    let optionChannel = [{text: "-- Select Channel", value: 0}];
    let optionInsur   = [{text: "-- Select Agency", value: 0}];
    
    channel.ordered.forEach( e => {
      if(!!channel.data[e].channel_type)
        optionChannel.push({text: channel.data[e].name, value: e})
    });

    agency.ordered.forEach( e => {
      let item = agency.data[e];
      if( (!!item && item.channel_id === channelID && !arrAgencyID.includes(e)) || (e === agencyID)
        || (!!agency_id && agency_id === e) )
        optionInsur.push({text: item.name, value: e})
    });

    return (
      <Fragment>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Channel</label>
            <Select
              id            = "channel_id"
              onChange      = { this.channelChange }
              refHTML       = { e => this._channelSelect = e }
              value         = { channelID }
              options       = { optionChannel } />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Agency</label>
            <Select
              id            = "insur_id"
              refHTML       = {e => this._insurSelect = e}
              value         = { agencyID }
              onChange      = { this.agencyChange }
              options       = { optionInsur } />
          </div>
        </div>
      </Fragment>
      
    );
  }

  componentDidMount(){
    let { dataGroup } = this.props
    if(!!dataGroup){
      let { channel_id: channelID, agency_id: agencyID, status } = dataGroup;
      this.setState({channelID, agencyID, status: (!!status ? true : false) });
    }
  }

  render() {
    let { dataGroup } = this.props;
    let { status } = this.state;

    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Key</label>
            <input defaultValue={ dataGroup ? dataGroup.key : "" } className={`form-control`} name="key" id="key" ref={e => this._keyInput = e} />
          </div>
        </div>

        { this.renderChannelSelect() }

        {
          (!!dataGroup) ?
          (
            <div className="form-group">
              <div className="col-xs-12">
                <label style={{display: 'flex'}}>
                  <span className="m-r-15">Status</span>
                  <Switch
                    className       = "react-switch"
                    onChange        = { status => this.setState({status}) }
                    checked         = { status }
                    height          = { 20 }
                    width           = { 40 }
                    aria-labelledby = "neat-label"
                  />
                </label>
              </div>
            </div>
          ): null
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
