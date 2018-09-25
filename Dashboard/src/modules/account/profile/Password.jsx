import React, { Component } from 'react';


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
    let { profile } = this.props;
    let { isWorking } = profile;

    return (
      <form ref={e => this._formSubmit = e} method="post" className={`formSubmit ${ isWorking ? 'loading' : '' }`} onSubmit={ this.handelSubmitInfo }>
        <div className="form-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="password" className="control-label">Password Current</label>
                <input ref={e => this._passwordInput = e} name="password" form-valid="str:6:32" type="password" id="password" className="form-control" placeholder="Password current" />
                <span className="help-block hidden"> Password Current invalid or range exceed of 6 - 32 characters </span> 
              </div>
            </div>
            {/*/span*/}
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="passNew" className="control-label">Password New</label>
                <input ref={e => this._passNewInput = e} name="passNew" form-valid="str:6:32" type="password" id="passNew" className="form-control" placeholder="Password new" />
                <span className="help-block hidden"> Password New invalid or range exceed of 6 - 32 characters </span> 
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="repass" className="control-label">RePassword New</label>
                <input ref={e => this._repassInput = e} name="repass" form-valid="str:6:32" type="password" id="repass" className="form-control" placeholder="Repassword new" />
                <span className="help-block hidden"> RePassword New invalid or range exceed of 6 - 32 characters </span> 
              </div>
            </div>
            {/*/span*/}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-flat btn-outline btn-info fcbtn btn-1b"> Update</button>
        </div>
      </form>
    );
  }
}

export default Password;