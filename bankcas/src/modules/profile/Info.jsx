import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';

class Info extends Component {
  _firstnameInput = null;
  _lastnameInput  = null;
  _formSubmit     = null;
  _phoneInput     = null;
  _addressInput   = null;
  _genderInput    = null;

  handelSubmitInfo = (e) => {
    e.preventDefault();

    let valid = this.props.validateForm(this._formSubmit,
      [
        {id: 'firstName', rule: 'str:7:200'},
        {id: 'lastname', rule: 'str:7:200'},
        {id: 'phone', rule: 'phone'},
        {id: 'gender', rule: 'int:0:1'},
        {id: 'address', rule: 'str:7:200'}
      ]
    );
    
    if (valid){
      let firstname   = (this._firstnameInput != null) ? this._firstnameInput.value : null;
      let lastname    = (this._lastnameInput != null) ? this._lastnameInput.value : null;
      let phone       = (this._phoneInput != null) ? this._phoneInput.value : null;
      let address     = (this._addressInput != null) ? this._addressInput.value : null;
      let gender      = (this._genderInput != null) ? this._genderInput.value : null;

      if (firstname && lastname && phone && address && gender){

        let data = {
          firstname,
          lastname,
          phone,
          address,
          gender
        };

        if(this.props.handelSubmit != null) this.props.handelSubmit(data);

      }
    }

  }

  render() {
    let { t, profile } = this.props;
    let { info, isWorking } = profile;

    return (
      <Form ref={e => this._formSubmit = e} loading={isWorking} onSubmit={ this.handelSubmitInfo }>
        <Form.Field>
          <label>{t('profile:email')}</label>
          <input value={info.email} disabled />
        </Form.Field>

        <Form.Group widths='equal'>
          <Form.Field>
            <label>{t('profile:firstName')}</label>
            <input 
              className="form-control"
              id="firstname"
              ref={e => this._firstnameInput = e}
              defaultValue={info.firstname} 
              placeholder={t('profile:firstName')} />
          </Form.Field>
          <Form.Field>
            <label>{t('profile:lastname')}</label>
            <input
              className="form-control"
              id="lastname"
              ref={e => this._lastnameInput = e}
              defaultValue={info.lastname}
              placeholder={t('profile:lastname')} />
          </Form.Field>
        </Form.Group>
        
        <Form.Group widths='equal'>
          <Form.Field width={5}>
            <label>{t('profile:phone')}</label>
            <input
              className="form-control"
              id="phone"
              ref={e => this._phoneInput = e}
              defaultValue={info.phone}
              placeholder={t('profile:phone')} />
          </Form.Field>
          <Form.Field>
            <label>{t('profile:gender')}</label>
            <select  ref={e => this._genderInput = e} id="gender" defaultValue={info.gender} className="form-control">
              <option value="1">{t('profile:male')}</option>
              <option value="0">{t('profile:feMale')}</option>
            </select>
          </Form.Field>
        </Form.Group>
        
        <Form.Field>
          <label>{t('profile:address')}</label>
          <input 
            ref={e => this._addressInput = e}
            className="form-control" 
            id="address" 
            defaultValue={info.address} 
            placeholder={t('profile:address')} />
        </Form.Field>
        <button className="btn btn-success" type="submit">{t('profile:submit')}</button>
      </Form>
    );
  }
}

export default Info;