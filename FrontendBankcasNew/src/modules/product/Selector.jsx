import React, { Component, Fragment } from 'react';

import { Select, Dropzone } from 'components';
import { isEmpty } from 'utils/functions';
import ItemFile from './ItemFile';

class Selector extends Component {
  
  _selector : null;
  _events   : null;
  _el       : {};
  
  renderAttr = (tag, option) => {
    let attr = {className: 'form-control'};
    let { className, required, defaultValue, id, events } = option;
    let { disabled } = this.props;

    tag.forEach(e => {
      e = e.split(':');
      attr[e[0]] = e[1]
    });
    
    if(!!required)                    attr['required']      = true;
    if(undefined !== className)       attr['required']      +=  ' ' + attr['required'];
    if(undefined !== defaultValue)    attr['defaultValue']  = defaultValue;
    if(undefined !== id)              attr['id']            =  id;
    
    if(!!events) this._events = events;
    if(!!disabled) attr['disabled'] = 'disabled';

    this._el = this._selector;

    return attr;
  }

  componentDidMount(){
    if(!!this.props.formElement) this.props.formElement(this._selector);

    if(!!this._events){
      for (let name in this._events) {
        this.props.callbackFunction(this._selector, name, this._events[name]);
      }
    };
    if(!!this._funs) this.handelFunctions({selector: this._selector, funs: this._funs});
  }

  renderInput = (tag, data) => {
    let { id, className, required, defaultValue, events, ...rest } = data;
    let { dataRequest } = this.props;

    if(!!dataRequest && !!dataRequest.detail && !isEmpty(dataRequest.detail))
      defaultValue = dataRequest.detail[id];
    
    let attr = this.renderAttr(tag, {className, required, defaultValue, id, events});
    
    return <input
      key = { defaultValue || ""}
      ref = { e => this._selector = e }
      {...rest}
      {...attr} />;
  }

  renderSelect = (tag, data) => {
    let { dataRequest, filter, t } = this.props;
    let { id, className, required, defaultValue, options, events, ...rest } = data;
    defaultValue = "-1"
    if(!!dataRequest && !!dataRequest.detail && !isEmpty(dataRequest.detail))
      defaultValue = dataRequest.detail[id];
    
    let attr = this.renderAttr(tag, {className, required, defaultValue, id, events});

    return (
      <Select
        key = { defaultValue || ""}
        refHTML = { e => this._selector = e }
        filter = { filter }
        t = { t }
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
        key = { defaultValue || ""}
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
        <input  key = { defaultChecked || ""} defaultChecked={defaultChecked} ref = { e => this._selector = e } {...attr} {...rest} id={id ? id : ""} type="checkbox" />
        <label htmlFor={id ? id : ""} > {name ? name : ""} </label>
      </div>
    )
  }

  renderRadio = () => {

  }

  renderInputFile = (tag, data) => {
    let { dataRequest, events } = this.props;
    let { id, className, required, defaultValue, ...rest } = data;

    let attr = this.renderAttr(tag, {className, required, defaultValue, id, events});

    let event = {};

    if(!!events && !isEmpty(events) && !!events[id] && !isEmpty(events[id]))
      for(let key in events[id])
        event[key] = events[id][key];

    if(!!dataRequest && !!dataRequest.detail && !isEmpty(dataRequest.detail))
        defaultValue = dataRequest[id];

    let item = !!defaultValue && !isEmpty(defaultValue) ? <ItemFile handelRemoveClick = { this.props.handelRemoveClick } files={defaultValue} /> :  null

    if(!!this.props.disabled) return item;

    return (
      <Fragment>
        <Dropzone
          style     = {{height: '100%'}}
          {...event}
          {...rest}
          multiple  = {false}
          {...attr} />
        {item ? item : null}
      </Fragment>
      
    )
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
      case 'inputFile':
        return this.renderInputFile(tag, data);
      default:
        return null
    }
  }

  handelFunctions = ({selector, funs}) => {
    funs.forEach(name => {
      let f = this.props[name];
      if(!!f && f instanceof Function) f(selector);
    })
  }

  render() {
    let { selector, t, dataRequest } = this.props;
    let { plugin, namePlugin, label, tag, message, lang, col, funs, ...rest } = selector;

    if(!!plugin) if(!!this.props[namePlugin]) return this.props[namePlugin]({selector, dataRequest});

    if(!!funs && 'push' in funs) this._funs = funs; //this.handelFunctions({selector, funs});

    return (
      <div className={`col-xs-${col ? col : 12}`}>
        <label>{label ? (lang ? t(`product:${lang}`) : label) : ''}</label>
        {
          this.renderSelector(tag, {...rest})
        }
        <span className="help-block">{ message }</span>
      </div>
    )
  }
}

export default Selector;