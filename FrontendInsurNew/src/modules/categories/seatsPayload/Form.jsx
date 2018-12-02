import React, { Component } from 'react';

import { Select } from 'components';
import { MIN_YEAR, MAX_YEAR } from 'config/constants';
import { validateForm } from 'utils/validate';

class FormAdd extends Component {
  _nameInput          = null;
  _ratioInput         = null;
  _typeSelect         = null;
  _yearSelect         = null;
  _formData           = null;
  _carType            = null;

  onSubmitData = (e) => {
    e.preventDefault();

    let valid = validateForm(this._formData,
      [
        {id: 'name', rule: 'str:3:200'},
        {id: 'ratio', rule: 'num:0:100'},
        {id: 'year_id', rule: 'str:24:24'},
        {id: 'carType', rule: 'str:24:24'},
      ]
    );

    if(valid){
      let name      = (!!this._nameInput) ? this._nameInput.value : null;
      let ratio     = (!!this._ratioInput) ? this._ratioInput.value : null;
      // let type      = (!!this._typeSelect) ? this._typeSelect.value : null;
      let year_id   = (!!this._yearSelect) ? this._yearSelect.value : null;
      let carType   = (!!this._carType) ? this._carType.value : null;

      let data = { name, ratio, carType, year_id };
      // console.log(data)
      if(!!this.props.formSubmitData) this.props.formSubmitData(data);
    }

  }

  render() {
    let { years, carType } = this.props;

    let optionYear = [{text: "-- Select year", value: 0}];
    years.ordered.forEach( e => {
      if(years.data[e].removed === 0){
        let name = "";
        let { min, max } = years.data[e];

        if(min === MIN_YEAR) name = `Under ${max} year`;
        else if( min >= MIN_YEAR && max <= MAX_YEAR) name = `From ${min} to under ${max} year`;
        else name = `More than ${max} year`;

        optionYear.push({text: name, value: e})
      }
        
    });

    let optionCarType = [{text: "-- Select car type", value: 0}];
    carType.ordered.forEach( e => {
      if(carType.data[e].removed === 0){
        let { name } = carType.data[e];

        optionCarType.push({text: name, value: e})
      }
    });

    let { dataGroup } = this.props;

    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Name</label>
            <input defaultValue={ dataGroup ? dataGroup.name : "" } ref={ e => this._nameInput = e} id="name" className="form-control" />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Ratio</label>
            <input defaultValue={ dataGroup ? dataGroup.ratio : 0 } ref={ e => this._ratioInput = e} id="ratio" className="form-control" />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Year</label>
            <Select
              id            = "year_id"
              refHTML       = { e => this._yearSelect = e }
              defaultValue  = { dataGroup ? dataGroup.year_id : "" }
              options       = {optionYear} />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Car Type</label>
            {/* <select defaultValue={ dataGroup ? dataGroup.type : "" } ref={ e => this._typeSelect = e} id="type" className="form-control">
              <option>-- Select type</option>
              <option value="1">Motor for business</option>
              <option value="0" >Motor for personal</option>
            </select> */}

            <Select
              id            = "carType"
              refHTML       = { e => this._carType = e }
              defaultValue  = { dataGroup ? dataGroup.carType : "" }
              options       = { optionCarType } />

          </div>
        </div>

        <div className="form-actions m-t-30">
          <button type="submit" className="btn btn-flat btn-outline btn-info"><i className="fa fa-check"></i> Save</button>
          <button onClick={this.props.onClose} type="button" className="right-side-toggle btn-flat btn-outline btn btn-danger m-l-15">Cancel</button>
          <div className="clear"></div>
        </div>

      </form>
    );
  }
}


export default FormAdd;