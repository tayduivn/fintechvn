import React, { Component, Fragment } from 'react';

import { validateForm } from 'utils/validate';
import { Select } from 'components';

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

  componentDidMount(){
    let { dataGroup } = this.props
    if(!!dataGroup){
      let { channel_id: channelID, agency_id: agencyID } = dataGroup;
      this.setState({channelID, agencyID });
    }
  }


  onSubmitData = (e) => {
    e.preventDefault();

    let valid = validateForm(this._formData,
      [
        {id: 'name', rule: 'str:3:200'},
        {id: 'channel_id', rule: 'str:24:24'},
        {id: 'insur_id', rule: 'str:24:24'},
      ]
    );

    if(valid){
      let name       = (this._nameInput != null) ? this._nameInput.value : "";
      let channel_id = (this._channelSelect != null) ? this._channelSelect.value : "";
      let agency_id  = (this._insurSelect != null) ? this._insurSelect.value : "";

      if(!!this.props.formSubmitData) this.props.formSubmitData({name, channel_id, agency_id});
    }
  }

  agencyChange = (value) => {
    this.setState({agencyID: value});
  }

  channelChange = (value) => {
    this.setState({channelID: value});
  }

  renderChannelSelect = () => {
    let { channel, agency } = this.props;
    let { channelID, agencyID }       = this.state;
    let optionChannel = [{text: "-- Select Channel", value: 0}];
    let optionInsur   = [{text: "-- Select Agency", value: 0}];

    channel.ordered.forEach( e => {
      let item = channel.data[e];
      if(!!item)
        optionChannel.push({text: item.name, value: e})
    });

    agency.ordered.forEach( e => {
      let item = agency.data[e];
      if(!!item && item.channel_id === channelID )
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
              value         = { !!channelID ? channelID : 0 }
              options       = { optionChannel } />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Agency</label>
            <Select
              id            = "insur_id"
              refHTML       = {e => this._insurSelect = e}
              value         = { !!agencyID ? agencyID : 0  }
              onChange      = { this.agencyChange }
              options       = { optionInsur } />
          </div>
        </div>
      </Fragment>

    );

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
