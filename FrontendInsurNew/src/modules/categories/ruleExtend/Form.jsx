import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CKEditor from "react-ckeditor-component";

import { validateForm } from 'utils/validate';

class FormAdd extends Component {
  _nameInput          = null;
  _codeInput          = null;
  _ratioInput         = null;
  _typeSelect         = null;
  _formData           = null;
  _minYearInput       = null;

  constructor(props){
    super(props);
    this.state = {
      content       : ""
    }
  }

  onSubmitData = (e) => {
    e.preventDefault();
    
    let valid = validateForm(this._formData,
      [
        {id: 'name', rule: 'str:3:200'},
        {id: 'code', rule: 'base:^([\\w]{3,200})?$'},
        {id: 'ratio', rule: 'num:0:100'},
        {id: 'type', rule: 'int:0:1'},
        {id: 'minYear', rule: 'int:0:100'},
      ]
    );

    if(valid){
      let { content } = this.state;
      let name      = (!!this._nameInput) ? this._nameInput.value : "";
      let code      = (!!this._codeInput) ? this._codeInput.value : "";
      let ratio     = (!!this._ratioInput) ? this._ratioInput.value : 0;
      let type      = (!!this._typeSelect) ? this._typeSelect.value : 0;
      let minYear   = (!!this._minYearInput) ? this._minYearInput.value : 0;

      let data = { name, ratio, type, code, content, minYear };

      if(!!this.props.formSubmit) this.props.formSubmit(data);
    }

  }

  descriptionChange = (evt) => {
    let content = evt.editor.getData();
    this.setState({content})
  }

  componentDidMount(){
    let { dataGroup } = this.props;
    if(!!dataGroup){
      let { content }  = dataGroup;
      content = !!content ? content : "";
      this.setState({content});
    }
  }

  render() {
    let { dataGroup } = this.props;

    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <button className="btn-flat btn btn-success pull-right">
          <i className={`${!!dataGroup ? 'ti-check' : 'fa fa-plus'} m-r-5`} />
          {
            !!dataGroup ? "Update" : "Create"
          }
        </button>
        <Link to="/categories/rule-extends" className="btn-flat btn btn-info m-r-15 pull-left">
          <i className="ti-arrow-left m-r-5" />
          Back to list
        </Link>
        
        <div className="clear"></div>
        <hr style={{marginTop: '10px', marginBottom: "10px"}}/>
        
        <div className="form-group">
          <div className="col-xs-12">
            <label>Name</label>
            <input defaultValue={ dataGroup ? dataGroup.name : "" } ref={ e => this._nameInput = e} id="name" className="form-control" />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-3">
            <label>Code</label>
            <input defaultValue={ dataGroup ? dataGroup.code : "" } ref={ e => this._codeInput = e} id="code" className="form-control" />
          </div>
          <div className="col-xs-3">
            <label>Type</label>
            <select defaultValue={ dataGroup ? dataGroup.type : "" } ref={ e => this._typeSelect = e} id="type" className="form-control">
              <option>-- Select type</option>
              <option value="0">Value car</option>
              <option value="1" >Insurance fees</option>
            </select>
          </div>
          <div className="col-xs-3">
            <label>Ratio</label>
            <input defaultValue={ !!dataGroup && !!dataGroup.ratio ? dataGroup.ratio : 0 } ref={ e => this._ratioInput = e} id="ratio" className="form-control" />
          </div>

          <div className="col-xs-3">
            <label>Min year apply</label>
            <input defaultValue={ !!dataGroup && !!dataGroup.minYear ? dataGroup.minYear : 0 } ref={ e => this._minYearInput = e} id="minYear" className="form-control" />
          </div>

        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label>Content</label>
            <CKEditor
              content={this.state.content} 
              events={{
                change: this.descriptionChange
              }} />
          </div>
        </div>

      </form>
    );
  }
}


export default FormAdd;