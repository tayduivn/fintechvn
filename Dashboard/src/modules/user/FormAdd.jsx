import React, { Component, Fragment } from 'react';

import { Select } from 'components';
import { validateForm, validate } from 'utils/validate';

class FormAdd extends Component {
  _emailInput       = null;
  _passInput        = null;
  _firstnameInput   = null;
  _lastnameInput    = null;
  _phoneInput       = null;
  _addressInput     = null;
  _formData         = null;
  _channelSelect    = null;
  _agencySelect     = null;
  _genderSelect     = null;
  _statusSelect     = null;
  
  constructor(props){
    super(props);
    this.state = {
      channelID   : null,
      agencyID    : null,
      userEditID  : null
    }
  }

  componentWillMount(){
    let { profile, idUser, users } = this.props;
    let agencyID  = null;
    let channelID = null;

    if (profile.info && profile.info.account_type === 1){
      agencyID  = profile.info.agency;
      channelID = profile.info.channel;
    }
    
    if(idUser){
      agencyID  = users.data[idUser].agency.id;
      channelID = users.data[idUser].channel.id;
    }

    this.setState({
      agencyID,
      channelID,
    })
  }

  onSubmitData = (e) => {
    e.preventDefault();
    let { idUser } = this.props;

    let valid = validateForm(this._formSubmit,
      [
        {id: 'email', rule: 'email:7:200'},
        {id: 'firstname', rule: 'str:3:200'},
        {id: 'lastname', rule: 'str:3:200'},
        {id: 'phone', rule: 'phone'},
        {id: 'address', rule: 'str:3:200'},
        {id: 'gender', rule: 'int:0:1'}
      ]
    );
    
    
    if(valid && idUser && this._passInput != null && this._passInput.value !== "") 
      valid = validate(this._passInput, 'str:6:32');
    else if(valid && !idUser && this._passInput != null) valid = validate(this._passInput, 'str:6:32');

    if(valid && this._channelSelect != null) valid = validate(this._channelSelect, 'str:24:24');
    if(valid && this._agencySelect != null) valid = validate(this._agencySelect, 'str:24:24');
    if(valid && this._statusSelect != null) valid = validate(this._statusSelect, 'int:0:1');
    
    if(valid){
      let email       = (this._emailInput != null) ? this._emailInput.value : null;
      let password    = (this._passInput != null) ? this._passInput.value : null;
      let firstname   = (this._firstnameInput != null) ? this._firstnameInput.value : null;
      let lastname    = (this._lastnameInput != null) ? this._lastnameInput.value : null;
      let phone       = (this._phoneInput != null) ? this._phoneInput.value : null;
      let address     = (this._addressInput != null) ? this._addressInput.value : null;
      let gender      = (this._genderSelect != null) ? this._genderSelect.value : null;

      if(email && firstname && lastname && phone && address && gender){
        let { channelID : channel , agencyID: agency } = this.state;

        let data = {
          email,
          firstname,
          lastname,
          phone,
          address,
          gender,
          channel,
          agency
        }

        if(!idUser) data.password = password;
        else if(password) data.password = password;
        else if(this._statusSelect != null) data.status = this._statusSelect.value;
        
        if(!!this.props.formSubmitDataUser) this.props.formSubmitDataUser(data);
      }
    }
  }

  agencyChange = (value) => {
    this.setState({agencyID: value});
  }

  channelChange = (value) => {
    this.setState({channelID: value});
  }

  renderFooter = () => {
    let { channel, agency, users, profile, idUser } = this.props;
    let user = (idUser) ? users.data[idUser] : null;

    if (!profile.info || profile.info.account_type === 1) return null;

    let { channelID } = this.state;

    let optionChannel = [{text: "-- Select Channel", value: 0}];
    channel.ordered.forEach( e => {
        optionChannel.push({text: channel.data[e].name, value: e})
    });

    let optionAgency = [{text: "-- Select Agency", value: 0}];


    agency.ordered.forEach( e => {

      if(agency.data[e].chanel_id === channelID){
        let flag =  false;

        users.ordered.forEach( i => {
          if(users.data[i].agency.id === e && user.agency.id !== e){
            flag = true;
            return;
          }
        })

        if(!flag)
          optionAgency.push({text: agency.data[e].name, value: e})
      }
    });

    return (
      <Fragment>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Channel</label>
            <Select
              onChange={ this.channelChange }
              id="channel"
              refHTML={e => this._channelSelect = e}
              defaultValue = { (user ? user.channel.id : null)}
              options = {optionChannel}/>
            <span className="help-block">Channel invalid</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Agency</label>
            <Select
              onChange = { this.agencyChange }
              refHTML={e => this._agencySelect = e}
              defaultValue = { (user ? user.agency.id : null)}
              id="agency"
              options = {optionAgency}/>
            <span className="help-block">Agency invalid</span>
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    let { channel, agency, users, idUser } = this.props;
    let { channelID } = this.state;

    let optionChannel = [{text: "-- Select Channel", value: 0}];
    channel.ordered.forEach( e => {
        optionChannel.push({text: channel.data[e].name, value: e})
    });

    let optionAgency = [{text: "-- Select Agency", value: 0}];


    agency.ordered.forEach( e => {
      users.ordered.forEach( i => {
        if(agency.data[e].chanel_id === channelID && users.data[i].agency.id !== e)
          optionAgency.push({text: agency.data[e].name, value: e})
      })
      
    });

    let user = (idUser) ? users.data[idUser] : null;

    // if (idUser && !user) return null;

    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Email address</label>
            <input defaultValue={ user ? user.email : "" } className={`form-control`} name="email" id="email" ref={e => this._emailInput = e} />
            <span className="help-block">Email invalid or 7 - 100 characters</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Password</label>
            <input defaultValue="" className="form-control" name="password" id="password" type="password" ref={e => this._passInput = e} />
            <span className="help-block">Email invalid or 7 - 100 characters</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>First name</label>
            <input defaultValue={ user ? user.firstname : "" } className="form-control" name="firstname" id="firstname" ref={e => this._firstnameInput = e} />
            <span className="help-block">Firstname 3 - 100 characters</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Last name</label>
            <input defaultValue={ user ? user.lastname : "" } className="form-control" name="lastname" id="lastname" ref={e => this._lastnameInput = e} />
            <span className="help-block">Lastname 3 - 100 characters</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Phone</label>
            <input defaultValue={ user ? user.phone : "" } className="form-control" name="phone" id="phone" ref={e => this._phoneInput = e}/>
            <span className="help-block">Phone invalid</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Address</label>
            <input defaultValue={ user ? user.address : "" } className="form-control" name="address" id="address" ref={e => this._addressInput = e} />
            <span className="help-block">Address 5 - 200 characters</span>
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Gender</label>
            <select defaultValue={ user ? user.gender : 1 } ref={e => this._genderSelect = e } className="form-control" name="gender" id="gender">
              <option> -- Select Gender</option>
              <option value={1}> Male</option>
              <option value={0}> Female</option>
            </select>
            <span className="help-block">Agency invalid</span>
          </div>
        </div>

        {
          user
          ? (
            <div className="form-group">
              <div className="col-xs-12">
                <label>Status</label>
                <select defaultValue={ user ? user.status : 1 } ref={e => this._statusSelect = e } className="form-control" name="status" id="status">
                  <option value={1}> Active</option>
                  <option value={0}> Unactive</option>
                </select>
                <span className="help-block">Agency invalid</span>
              </div>
            </div>
          )
          : null
        }

        {this.renderFooter()}

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