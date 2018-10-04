import React, { Component } from 'react';

import { Select } from 'components';
import { isEmpty } from 'utils/functions';

class Selector extends Component {
  
  _selector : null;
  _events   : null;
  _el       : {};
  
  renderAttr = (tag, option) => {
    let attr = {className: 'form-control'};
    let { className, required, defaultValue, id, events } = option;
    
    tag.forEach(e => {
      e = e.split(':');
      attr[e[0]] = e[1]
    });
    
    if(!!required)                    attr['required']      = true;
    if(undefined !== className)       attr['required']      +=  ' ' + attr['required'];
    if(undefined !== defaultValue)    attr['defaultValue']  = defaultValue;
    if(undefined !== id)              attr['id']            =  id;
    if(!!events) this._events = events;

    this._el = this._selector;

    return attr;
  }

  componentDidMount(){
    if(!!this.props.formElement) this.props.formElement(this._selector);

    if(!!this._events){
      for (let name in this._events) {
        this.props.callbackFunction(this._selector, name, this._events[name]);
      }
    }
  }

  renderInput = (tag, data) => {
    let { id, className, required, defaultValue, events, ...rest } = data;
    let { dataRequest } = this.props;

    if(!!dataRequest && !!dataRequest.detail && !isEmpty(dataRequest.detail))
      defaultValue = dataRequest.detail[id];
    
    let attr = this.renderAttr(tag, {className, required, defaultValue, id, events});
    
    return <input
      ref = { e => this._selector = e }
      {...rest}
      {...attr} />;
  }

  renderSelect = (tag, data) => {
    let { dataRequest, filter } = this.props;
    let { id, className, required, defaultValue, options, events, ...rest } = data;

    if(!!dataRequest && !!dataRequest.detail && !isEmpty(dataRequest.detail))
      defaultValue = dataRequest.detail[id];
    
    let attr = this.renderAttr(tag, {className, required, defaultValue, id, events});

    return (
      <Select
        refHTML = { e => this._selector = e }
        filter = { filter }
        {...rest}
        {...attr}
        options = { options} />
    )
    
  }

  renderTextarea = (tag, data) => {
    let { dataRequest } = this.props;
    let { id, className, required, defaultValue, events, ...rest } = data;

    if(!!dataRequest && !!dataRequest.detail && !isEmpty(dataRequest.detail))
      defaultValue = dataRequest.detail[id];
    
    let attr = this.renderAttr(tag, {className, required, defaultValue, id, events});

    return (
      <textarea
        ref = { e => this._selector = e }
        {...rest}
        {...attr} ></textarea>
    )
  }

  renderCheckbox = (tag, data) => {
    let { dataRequest } = this.props;

    let { id, className, name, required, events, ...rest } = data;

    let defaultChecked = false;

    if(!!dataRequest && !!dataRequest.detail && !isEmpty(dataRequest.detail)){
      if(!!dataRequest.detail.ruleExtends && !isEmpty(dataRequest.detail.ruleExtends)){
        if(!!dataRequest.detail.ruleExtends[id]) defaultChecked = true;
      }
    }

    let attr = this.renderAttr(tag, {className, required, id, events});

    return (
      <div className="checkbox checkbox-info pull-left p-t-0 m-t-15">
        <input defaultChecked={defaultChecked} ref = { e => this._selector = e } {...attr} {...rest} id={id ? id : ""} type="checkbox" />
        <label htmlFor={id ? id : ""} > {name ? name : ""} </label>
      </div>
    )
  }

  renderRadio = () => {

  }

  renderSelector = (tag, data) => {
    tag = tag.split('>');
    let type = tag[0];
      tag.splice(0, 1);

    switch(type){
      case 'input':
        return this.renderInput(tag, data);
      case 'textarea':
        return this.renderTextarea(tag, data);
      case 'select':
        return this.renderSelect(tag, data);
      case 'checkbox':
        return this.renderCheckbox(tag, data);
      default:
        return null
    }
  }

  render() {
    let { selector } = this.props;
    let { label, tag, message, col, ...rest } = selector;
    return (
      <div className={`col-xs-${col ? col : 12}`}>
        <label>{label ? label : ''}</label>
        {
          this.renderSelector(tag, {...rest})
        }
        <span className="help-block">{ message }</span>
      </div>
    )
  }
}

export default Selector;