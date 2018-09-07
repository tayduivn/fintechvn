import React, { Component, Fragment } from 'react';
import { Checkbox, Form, TextArea } from 'semantic-ui-react';

import { Select } from 'components';

class FormData extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeBlock : false
    }
  }


  renderItemForm = (item, x) => {

    let { detail } = this.props.dataRequest;
    let valudeDF = (item.name ? ( detail[item.name] ? detail[item.name] : '' ) : '');
    let {action} = this.props;
    let disabled = true; // (action === 'edit' ? ((item.valid) ? item.valid : '') : (  ))
    if(action === 'edit') disabled = (item.disabled) ? item.disabled : false;
    if(action === 'clone') disabled = false;
    
    let inputHtml = (
      <Form.Input key = { x }
        autoComplete  = 'name'
        width         = { (item.col) ? item.col : 16}
        id            = { (item.id) ? item.id : ''}
        label         = { (item.label) ? item.label : ''}
        placeholder   = { (item.placeholder) ? item.placeholder : ''}
        name          = { (item.name) ? item.name : ''}
        form-valid    = { (item.valid) ? item.valid : ''}
        disabled      = { disabled }
        className     = { `form-item ${(item.className) ? item.className : ''}` }
        defaultValue  = { valudeDF }
      />);

    if(item.type === "select"){
      let countryOptions = (item.options.length > 0) ? (item.options) :  [];
      
      inputHtml = (
        <div key={x} className="field m-l-5 m-r-5"  >
          <label htmlFor="">{ (item.label) ? item.label : ''}</label>
          <Select
            placeholder   = { (item.placeholder) ? item.placeholder : ''}
            name          = { (item.name) ? item.name : ''}
            disabled      = { disabled }
            width         = { (item.col) ? item.col : 16}
            id            = { (item.id) ? item.id : ''}
            form-valid    = { (item.valid) ? item.valid : ''}
            className     = { `form-item ${(item.className) ? item.className : ''}` }
            defaultValue  = { valudeDF }
            options       = {countryOptions} />
        </div>
      );
    }

    if(item.type === "textArea"){
      inputHtml = (<TextArea
        key           = { x }
        name          = { (item.name) ? item.name : ''}
        defaultValue  = { valudeDF }
        className     = { `form-item ${(item.className) ? item.className : ''}` }
        placeholder   = { (item.placeholder) ? item.placeholder : ''}
        id            = { (item.id) ? item.id : ''}
        form-valid    = { (item.valid) ? item.valid : ''}
        disabled      = { disabled }
        rows          = { (item.rows) ? item.rows : 5} />);
    }

    if(item.type === "checkbox"){
      inputHtml = (
      <div width={12} key={x} className="m-l-5 m-r-5"  >
        <label htmlFor="">{ (item.label) ? item.label : ''}</label>
        <Checkbox width={12} />
      </div>);
    }

    return inputHtml;
  }

  renderForm = () => {
    let { data } = this.props;
    
    if(!data.block) return null;

    return data.block.map( (e, i) => {
      return (
        <fieldset key={i}>
          <legend>{(e.name ? e.name : '')}</legend>
          { (e.rows.length > 0) ? 
            (
              e.rows.map( (el, y ) => {
                return (
                  <Form.Group key={y} widths='equal'>
                    {
                      ( 
                        el.fields.length > 0
                        ? (
                          el.fields.map( (item, x) => {
                            return this.renderItemForm(item, x);
                          })
                        )
                        : null
                      )
                    }
                  </Form.Group>
                )
              })
            ) 
            : null 
          }
        </fieldset>
      )
    });
  }

  render() {
    let { data }     = this.props;

    if(data.block && data.block.length <= 0) return null;

    return (
      <Fragment>
        {this.renderForm()}
        
      </Fragment>
    );
  }
}

export default FormData;