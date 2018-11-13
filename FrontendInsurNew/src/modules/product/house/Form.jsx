import React, { Component, Fragment } from 'react';

import { isEmpty } from 'utils/functions';
import Selector from './../Selector';
import 'assets/plugins/bower_components/jquery-wizard-master/css/wizard.css';
import { Address, PriceFastHouse } from 'plugin';

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
            onClick = { () => !!view && this.setState({step: i})}
            style={style}
            key={ i }
            className = {`${ i !== step ? ( step > i ? 'active done' : (!!view ? '' : 'disabled') ) : 'current' }`}
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
        data        = { e => this.setState({[id]: e}) } />
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
  
    return <PriceFastHouse 
      selector      = { selector }
      t             = { t }
      disabled      = { !!view ? true : false }
      setStatePrice = { e => this.props.setStatePrice(e) }
      setStateLocal = { e => this.props.setStateLocal(e) }
      setRules      = { this.setRules(nameTep) }
      dataRequest   = { dataRequest } />;
  }

  nextStep = (nameStep) => () => {
    let { step } = this.state;
   
    ++step;
    this.setState({step});
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