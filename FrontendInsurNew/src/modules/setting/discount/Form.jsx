import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { validateForm } from 'utils/validate';
import  _ftNumber  from 'utils/number';

class FormAdd extends Component {
  _motorInput = null;
  _houseInput = null;
  _formData   = null;

  componentDidMount(){
    !!this._motorInput && _ftNumber.listener(this._motorInput, {maxLength: 2});
    !!this._houseInput && _ftNumber.listener(this._houseInput, {maxLength: 2});
  }

  onSubmitData = (e) => {
    e.preventDefault();

    let ru = [
      {id: "motor", rule: "int:1:25"},
      {id: "house", rule: "int:1:25"},
    ]
    let val = validateForm(this._formData, ru);

    if(val){
      let motor = !!this._motorInput ? this._motorInput.value : 0;
      let house = !!this._houseInput ? this._houseInput.value : 0;
      
      if(!!motor && !!house){
        !!this.props.formSubmit && this.props.formSubmit({motor, house});
      }
    }
  }
  

  render() {
    let { dataDefault } =  this.props;

    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal">
        <button className="btn-flat btn btn-success pull-right">
          <i className={`${!!dataDefault ? 'ti-check' : 'fa fa-plus'} m-r-5`} />
          {
            !!dataDefault ? "Update" : "Create"
          }
        </button>
        <Link to="/" className="btn-flat btn btn-info m-r-15 pull-left">
          <i className="ti-arrow-left m-r-5" />
          Back to home
        </Link>
        
        <div className="clear"></div>
        <hr style={{marginTop: '10px', marginBottom: "10px"}}/>
        <div className="form-group">
          <div className="col-xs-6">
            <label className="col-xs-3 control-label strong">Motor (%)</label>
            <div className="col-xs-9">
              <input defaultValue={!!dataDefault ? dataDefault.extra.motor : "" } id="motor" ref={e => this._motorInput = e} className="form-control" />
            </div>
          </div>

          <div className="col-xs-6">
            <label className="col-xs-3 control-label strong">House (%)</label>
            <div className="col-xs-9">
              <input defaultValue={!!dataDefault ? dataDefault.extra.house : "" } id="house" ref={e => this._houseInput = e} className="form-control" />
            </div>
          </div>

        </div>

      </form>
    );
  }
}


export default FormAdd;