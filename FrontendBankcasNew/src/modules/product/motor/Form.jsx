import React, { Component, Fragment } from 'react';

import { isEmpty } from 'utils/functions';
import Selector from './../Selector';
import { validateForm2 } from 'utils/validate';
import 'assets/plugins/bower_components/jquery-wizard-master/css/wizard.css';
import { Address, PriceFast } from 'plugin';

class Form extends Component {
  formElement = {};
  _formValid  = {};
  valueID     = {};

  constructor(props){
    super(props);
    this.state = {
      stepBegin : 0,
      step      : 0,
      stepEnd   : (!isEmpty(this.props.contents) ? this.props.contents.length - 1 : 0),
      data      : {}
    }
  }
  
  renderTabs = () => {
    let { tabs, view, t } = this.props;
    let { step } = this.state;

    if(!isEmpty(tabs)){
      let style = { width: `${100 / tabs.length }%` };
      return tabs.map( (e, i) => {
        return (
          <li
            onClick = { () => this.setState({step: i})}
            style={style}
            key={ i }
            className = {`${ i !== step ? ( step > i ? 'active done' : (!!view ? '' : '') ) : 'current' }`}
            role="tab" aria-expanded="false">
            <h4>
              <i className={e.icon ? e.icon : ''} /> {e.name ? ( e.lang ? t(`product:${e.lang}`) : e.name) : ''}
            </h4>
          </li>
        )
      })
    }
    return null;
  }

  prvStep = () => {
    let { step, stepEnd, stepBegin } = this.state;
    --step;
    this.setState({step});
    if(step !== stepEnd && !!this.props.onClickEnd) this.props.onClickEnd(false);
    if(step === stepBegin && !!this.props.stepBegin) this.props.stepBegin(true)
  }

  addressRender = (nameTep) => ({selector, dataRequest}) => {
    let { id } = selector;
    dataRequest = !!dataRequest && dataRequest.detail && dataRequest.detail[id] ? dataRequest.detail[id] : null;

    return (
      <Address 
        dataRequest = { dataRequest } 
        id          = { id }
        setRules    = { this.setRules(nameTep) }
        disabled    = { !!this.props.view ? true : false }
        data        = { e => this.props.setStateLocal({key: id, value: e}) } />
    )
  }

  setRules = (nameTep) => (rules) => {
    
    let r = this._formValid[nameTep].rules;

    for(let k in rules){
      let t = rules[k];
      r[t.id] = t;
    }
    this._formValid[nameTep].rules = r;
  }

  priceFast = (nameTep) => ({selector, dataRequest}) => {
    let { t, view } = this.props;
    
    return <PriceFast 
      selector      = { selector }
      t             = { t }
      disabled      = {!!view ? true : false }
      setStatePrice = { e => this.props.setStatePrice(e) }
      setRules      = { this.setRules(nameTep) }
      dataRequest   = { dataRequest } />;
  }

  nextStep = (nameStep) => () => {
    let { step, stepEnd, stepBegin, data } = this.state;
    
    let { view } = this.props;
    if(!!view) {
      ++step;
      this.setState({step});
    }else{
      
      let vail = validateForm2(this._formValid[nameStep].form, [...Object.values(this._formValid[nameStep].rules)]);
      // console.log(vail);
      // console.log(Object.values(this._formValid[nameStep].rules));
      if(!vail.error){
        ++step;
        for(let id in vail.data){
          if(!!this.state[id]) vail.data[id] = this.state[id]
        }
        this.setState({step, data: {...data, ...vail.data}});
        if(step === stepEnd && !!this.props.onClickEnd) this.props.onClickEnd(true);
        if(step !== stepBegin && !!this.props.stepBegin) this.props.stepBegin(false)
      }
    }
    
  }

  componentWillReceiveProps(nextProps){
    let { endClick } = nextProps;
    
    if(!!endClick){
      let keyValidArr = Object.keys(this._formValid);
      
      let st    = null;
      let data  = {};

      for(let i in keyValidArr){
        let k = keyValidArr[i];
        let vail = validateForm2(this._formValid[k].form, [...Object.values(this._formValid[k].rules)]);
        if(!vail.error){
          data = {
            ...data,
            ...vail.data
          }
        }else {
          if(st === null) st = i;
        }
      }

      if(st == null && !isEmpty(data) && !!this.props.formSubmit) this.props.formSubmit(data);
      if(st !== null) this.setState({step: +st});
      this.props.setStateLocal({key: 'endClick', value: false});
      
    }
  }

  _ftHandlerEvent = (DOMElement, eventName, handlerFunction) => {
    if (!!DOMElement && handlerFunction instanceof Function){
      if ('addEventListener' in DOMElement) DOMElement.addEventListener(eventName, handlerFunction);
      else if ('attachEvent' in DOMElement) DOMElement.attachEvent('on' + eventName, handlerFunction);
      else DOMElement['on' + eventName] = handlerFunction;
    }
  }

  callbackFunction = (el, name, cb, obj) =>{ 
    this._ftHandlerEvent(el, name, () => { 
      if(!!this[cb] && this[cb] instanceof Function) this[cb]({el, obj});
    })
  }

  customer_type = ({el, obj}) => {
    let type = !!el ? el.value : null;
    if(type !== null){
      let rule = 'base:^(\\d{7,15})?$'
      type = parseInt(type, 10);
      if(type === 2) rule = 'base:^(\\d{7,15})$';
      let { step } = obj;

      this._formValid[step].rules.forEach((e, i) => {
        if(e.id === "tax_number") this._formValid[step].rules[i] = {id: "tax_number", rule};
      })
    }
  }

  renderContents = () => {
    let { contents, dataRequest, view, t } = this.props;
    let { stepBegin, stepEnd, step } = this.state;

    if(!isEmpty(contents)){
     
      return contents.map( (e, i) => {
        if(!this._formValid[e.step]) this._formValid[e.step] = {form: null, rules: {}};

        if(!isEmpty(e.controls)){
          
          if(!!dataRequest && !isEmpty(dataRequest.detail))
            e.controls.map((els) => this.valueID[els.id] = dataRequest.detail[els.id]);
          
          return (
            <Fragment  key={ i }>
              <div ref={el => this._formValid[e.step].form = el } className={`wizard-pane ${i === step ? 'active' : ''}`} role="tabpanel" aria-expanded="false">
                {
                  e.controls.map((el, y) => {
                    
                    if(isEmpty(el)) return null;
                    return (
                      <div key={y} className="form-group">
                        {
                          el.map((selector, z) => {
                            let { id, rule } = selector;
                            
                            if(undefined !== id && undefined !== rule)
                            this._formValid[e.step].rules[id] = {id, rule};
                              
                            return(
                              <Selector
                                disabled          = { !!view ? true : false }
                                _ftHandlerEvent   = { this.props._ftHandlerEvent }
                                callbackFunction  = { (...p) => this.callbackFunction(...p, {step: e.step, id}) }
                                dataRequest       = { dataRequest }
                                handelRemoveClick = { this.props.handelRemoveClick }
                                events            = {!!this.props.events ? this.props.events : {}}
                                t                 = { t }
                                address           = { this.addressRender(e.step) }
                                priceFast         = { this.priceFast(e.step) }
                                key               = {z} selector={selector} />
                            )
                          })
                        }
                      </div>
                    )
                  })
                }
                <div className="wizard-buttons">
                  {
                    step !== stepBegin
                    ? (<button type="button" onClick={ this.prvStep } className="m-r-15 btn btn-rounded btn-danger fcbtn btn-outline btn-1e">{t('product:motor_btnPres')}</button>)
                    : null
                  }

                  {
                    step !== stepEnd
                    ? (<button type="button" onClick={ this.nextStep(e.step)} className="btn btn-rounded btn-success fcbtn btn-outline btn-1e">{t('product:motor_btnNext')}</button>)
                    : null
                  }
                  
                  
                </div>
              </div>
            </Fragment>
          )
        }
        return null;
      })
    }
    return null;
  };

  componentDidMount(){
    if(!!this.props.didMount) this.props.didMount();
  }

  render() {
    
    return (
      <div id="exampleValidator" className="wizard">
        <ul className="wizard-steps" role="tablist">
          {
            this.renderTabs()
          }
        </ul>
        <form id="validation" className="form-horizontal fv-form fv-form-bootstrap" noValidate="novalidate">
     
          <div className="wizard-content">
            {
              this.renderContents()
            }
          </div>
        </form>
      </div>
    );
  }
}

export default Form;