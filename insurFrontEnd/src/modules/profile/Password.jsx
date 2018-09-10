import React, { Component } from 'react';
import { Form  } from 'semantic-ui-react';

class Password extends Component {
  _passwordInput    = null;
  _passNewInput     = null;
  _formSubmit       = null;
  _repassInput      = null;

  handelSubmitInfo = (e) => {
    e.preventDefault();

    let valid = this.props.validateForm(this._formSubmit,
      [
        {id: 'password', rule: 'str:6:32'},
        {id: 'passNew', rule: 'str:6:32'},
        {id: 'repass', rule: 'str:6:32'}
      ]
    );

    if(valid) {
      let password  = (this._passwordInput != null) ? this._passwordInput.value : null;
      let passNew   = (this._passNewInput != null) ? this._passNewInput.value : null;
      let repass    = (this._repassInput != null) ? this._repassInput.value : null;

      if(password && passNew && repass){
        let data = {password, passNew, repass, id: this.props.profile.info.id}
        if(this.props.handelSubmit != null) this.props.handelSubmit(data);
        this._passwordInput.value = "";
        this._passNewInput.value = "";
        this._repassInput.value = "";
      }
    }
  }

  render() {
    let { t, profile } = this.props;
    let { isWorking } = profile;
    return (
      <Form ref={e => this._formSubmit = e} loading={isWorking} onSubmit={ this.handelSubmitInfo }>
        <Form.Field>
          <label>{t('profile:passCurrent')}</label>
          <input
            autoComplete="off"
            id="password"
            type="password"
            ref={e => this._passwordInput = e}
            placeholder={t('profile:passCurrent')} />
        </Form.Field>

        <Form.Field>
          <label>{t('profile:passNew')}</label>
          <input
            autoComplete="off"
            id="passNew" type="password"
            ref={e => this._passNewInput = e}
            placeholder={t('profile:passNew')} />
        </Form.Field>

        <Form.Field>
          <label>{t('profile:repass')}</label>
          <input
            autoComplete="off"
            id="repass"
            ref={e => this._repassInput = e}
            type="password"
            placeholder={t('profile:repass')} />
        </Form.Field>

        <button className="btn btn-success" type="submit">{t('profile:submit')}</button>
      </Form>
    );
  }
}

export default Password;