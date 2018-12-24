import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import CKEditor from "react-ckeditor-component";

class FormAdd extends Component {
  
  constructor(p){
    super(p);
    this.state = {
      provision : {}
    }
  }

  descriptionChange = (key) => (evt) => {
    let content = evt.editor.getData();
    let provision = { ...this.state.provision };

    provision[key] = content;
    this.setState({provision})
  }

  componentDidMount(){
    let { dataDefault } =  this.props;
    if(!!dataDefault){
      let { extra: provision } = dataDefault;
      this.setState({ provision })
    }
  }


  onSubmitData = (e) => {
    e.preventDefault();
    let { provision } = this.state;

    !!this.props.formSubmit && this.props.formSubmit(provision);
  }
  

  render() {
    let { dataDefault } =  this.props;
    let { provision } = this.state;
    
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
          <div className="col-xs-12">
            <label className="control-label strong">Provision (A)</label>
            <CKEditor
              content={ !!provision.a ? provision.a : ""}

              events={{
                change: this.descriptionChange('a')
              }} 
              />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label className="control-label strong">Provision (B)</label>
            <CKEditor
              content={ !!provision.b ? provision.b : ""} 
              events={{
                change: this.descriptionChange('b')
              }} />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label className="control-label strong">Provision (C)</label>
            <CKEditor
              content={ !!provision.c ? provision.c : ""} 
              events={{
                change: this.descriptionChange('c')
              }} />
          </div>
        </div>

        <div className="form-group">
          <div className="col-xs-12">
            <label className="control-label strong">Provision (D)</label>
            <CKEditor
              content={ !!provision.d ? provision.d : ""} 
              events={{
                change: this.descriptionChange('d')
              }} />
          </div>
        </div>

      </form>
    );
  }
}


export default FormAdd;