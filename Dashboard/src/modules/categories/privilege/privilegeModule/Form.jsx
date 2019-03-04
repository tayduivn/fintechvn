import React, { Component, Fragment } from 'react';

import { validate } from 'utils/validate';

class FormAdd extends Component {
  _nameInput          = null;

  onSubmitData = (e) => {
    e.preventDefault();

    let valid = validate(this._nameInput, 'str:3:200');
    valid     = !!valid && validate(this._sectionInput, 'base:^[a-zA-Z0-9]{3,200}$');

    if(!!valid){
      let name    = this._nameInput.value;
      let section = this._sectionInput.value;
      !!this.props.clickCreateItem && this.props.clickCreateItem({name, section})
    }
  }



  render() {
    let { item } = this.props;
    return (
      <Fragment>
        <div className="form-group m-b-15">
          <label htmlFor="name" className="col-sm-2 control-label m-t-5">Name</label>
          <div className="col-md-10">
            <input
              className     = {`form-control`}
              defaultValue  = { !!item ? item.name : "" }
              placeholder   = 'Name'
              ref           = { e => this._nameInput = e }
              id            = "name"  />
          </div>
          <div className="clearfix"></div>
        </div>

        <div className="form-group m-b-15">
          <label htmlFor="section" className="col-sm-2 control-label m-t-5">Section key</label>
          <div className="col-md-10">
            <input
              className     = {`form-control`}
              defaultValue  = { !!item ? item.section : "" }
              placeholder   = 'Section key'
              ref           = { e => this._sectionInput = e }
              id            = "section"  />
          </div>
          <div className="clearfix"></div>
        </div>

        <div className="modal-footer">
          <button onClick={ this.props.close } className="btn btn-danger btn-flat" type="submit">Canncel</button>,
          <button onClick={ this.onSubmitData } className="btn btn-success btn-flat" type="submit">Submit</button>
        </div>
      </Fragment>
      
    );
  }
}


export default FormAdd;
