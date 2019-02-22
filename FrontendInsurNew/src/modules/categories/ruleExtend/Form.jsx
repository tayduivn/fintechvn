import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CKEditor from "react-ckeditor-component";
import Switch from "react-switch";

import { validateForm } from 'utils/validate';
import _ftNumber from 'utils/number';

class FormAdd extends Component {
  _nameInput          = null;
  _codeInput          = null;
  _ratioInput         = null;
  _typeSelect         = null;
  _formData           = null;
  _minYearInput       = null;
  _countTypeSelect    = null;
  _priceInput         = null;
  _validForm = {
    name:    {id: 'name', rule: 'str:3:200'},
    code:    {id: 'code', rule: 'base:^([\\w]{3,200})?$'},
    ratio:   {id: 'ratio', rule: 'num:0.01:100'},
    type:    {id: 'type', rule: 'int:0:1'},
    minYear: {id: 'minYear', rule: 'int:0:100'},
    countType: {id: 'countType', rule: 'int:0:1'}
  };

  constructor(props){
    super(props);
    this.state = {
      content       : "",
      countType     : 0,
      status        : true
    }
  }

  onSubmitData = (e) => { 
    e.preventDefault();
    
    let valid = validateForm(this._formData, Object.values(this._validForm));
    let { status } = this.state;

    if(valid){
      let { content } = this.state;
      let name      = (!!this._nameInput) ? this._nameInput.value : "";
      let code      = (!!this._codeInput) ? this._codeInput.value : "";
      let ratio     = (!!this._ratioInput) ? this._ratioInput.value : 0;
      let type      = (!!this._typeSelect) ? this._typeSelect.value : 0;
      let minYear   = (!!this._minYearInput) ? this._minYearInput.value : 0;
      minYear     = _ftNumber.parse(minYear);

      let countType = (!!this._countTypeSelect) ? this._countTypeSelect.value : 0;
      countType     = _ftNumber.parse(countType);

      let price     = (!!this._priceInput) ? this._priceInput.value : 0;
      price         = _ftNumber.parse(price);
      

      let data = { name, ratio, type, code, content, minYear, countType, price, status };

      if(!!this.props.formSubmit) this.props.formSubmit(data);
    }

  }

  descriptionChange = (evt) => {
    let content = evt.editor.getData();
    this.setState({content})
  }

  countTypeChange = () => {
    let countType = !!this._countTypeSelect ? this._countTypeSelect.value : 0;
    countType = parseInt(countType, 10);

    this.setState({ countType })
  }

  handelFee = (dataGroup) => {
    if(!this.state.countType)
    return (
      <div className="col-xs-5">
        <label>Price</label>
        <input 
          defaultValue={ !!dataGroup && !!dataGroup.price ? dataGroup.price : "" }
          ref={ e => this._priceInput = e} 
          id="price" className="form-control text-center" />
      </div>
    );
    return (
      <React.Fragment>
        <div className="col-xs-3">
          <label>Type</label>
          <select defaultValue={ dataGroup ? dataGroup.type : "" } ref={ e => this._typeSelect = e} id="type" className="form-control">
            <option>-- Select type</option>
            <option value="0">Value car</option>
            <option value="1" >Insurance fees</option>
          </select>
        </div>

        <div className="col-xs-2">
          <label>Ratio</label>
          <input 
            defaultValue={ !!dataGroup && !!dataGroup.ratio ? dataGroup.ratio : 0 } 
            ref={ e => this._ratioInput = e} 
            id="ratio" className="form-control text-center" />
        </div>
      </React.Fragment>
    );
  }

  componentDidMount(){
    let { dataGroup } = this.props;
    if(!!dataGroup){
      let { content, countType, status }  = dataGroup;
      content = !!content ? content : "";
      status = !!status ? true : false;
      this.setState({content, countType, status});
    }
  }
  

  componentDidUpdate(){
    let { countType } = this.state;
    if(!countType){
      delete this._validForm.ratio;
      delete this._validForm.type;
      this._validForm.price = {id: 'price', rule: 'num:1'};
    }else{
      delete this._validForm.price;
      this._validForm.ratio     = {id: 'ratio', rule: 'num:0.01:100'};
      this._validForm.type = {id: 'type', rule: 'int:0:1'};
    }
    if(!!this._priceInput) _ftNumber.listener(this._priceInput, { maxLength: 12 })
  }
  

  render() {
    let { dataGroup } = this.props;
    let { status }    = this.state;

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
          <div className="col-xs-2">
            <label>Code</label>
            <input defaultValue={ dataGroup ? dataGroup.code : "" } ref={ e => this._codeInput = e} id="code" className="form-control" />
          </div>

          <div className="col-xs-3">
            <label>Count type</label>
            <select
              onChange      = { this.countTypeChange }
              defaultValue  = { dataGroup ? dataGroup.countType : "" } 
              ref           = { e => this._countTypeSelect = e} id="countType" 
              className     = "form-control">
              <option value="0">Permanent</option>
              <option value="1" >Ratio</option>
            </select>
          </div>

          {
            this.handelFee(dataGroup)
          }
          
          <div className="col-xs-2">
            <label>Min year apply</label>
            <input 
              defaultValue={ !!dataGroup && !!dataGroup.minYear ? dataGroup.minYear : 0 } 
              ref={ e => this._minYearInput = e} id="minYear" 
              className="form-control text-center" />
          </div>

        </div>

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