import React, { Component, Fragment } from 'react';

import { isEmpty } from 'utils/functions';
import Selector from './../Selector';
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

  priceFast = (nameTep) => ({selector, dataRequest}) => {
    let { t, view } = this.props;

    return <PriceFast 
      selector      = { selector }
      t             = { t }
      disabled      = {!!view ? true : false }
      setStatePrice = { e => this.props.setStatePrice(e) }
      // setRules      = { this.setRules(nameTep) }
      dataRequest   = { dataRequest } />;
  }
  
  renderTabs = () => {
    let { tabs } = this.props;
    let { step } = this.state;

    if(!isEmpty(tabs)){
      let style = { width: `${100 / tabs.length }%` };
      return tabs.map( (e, i) => {
        return (
          <li 
            style={style}
            key={ i }
            onClick = { () => this.setState({step: i})}
            className = {`${ i !== step ? ( step > i ? 'active done' : '' ) : 'current' }`}
            role="tab" aria-expanded="false">
            <h4>
              <i className={e.icon ? e.icon : ''} /> {e.name ? e.name : ''}
            </h4>
          </li>
        )
      })
    }
    return null;
  }

  prvStep = () => {
    let { step } = this.state;
    --step;
    this.setState({step});
  }

  nextStep = (nameStep) => () => {
    let { step } = this.state;
   
    ++step;
    this.setState({step});
  }

  // componentWillReceiveProps(nextProps){
  //   let { endClick } = nextProps;

  //   if(!!endClick){
  //     let key = Object.keys(this._formValid)[Object.keys(this._formValid).length - 1];
  //     let vail = validateForm2(this._formValid[key].form, this._formValid[key].rules);
  //     if(!vail.error){
  //      let data = {
  //        ...this.state.data,
  //        ...vail.data
  //      };
       
  //      if(!isEmpty(data) && !!this.props.formSubmit) this.props.formSubmit(data);
  //     }
  //   }
  // }

  addressRender = ({selector, dataRequest}) => {
    let { id } = selector;
    dataRequest = !!dataRequest && dataRequest.detail && dataRequest.detail[id] ? dataRequest.detail[id] : null;
    return (
      <Address disabled={true} dataRequest={dataRequest} id={ id } data={e => this.setState({[id]: e})}/>
    )
  }

  renderContents = () => {
    let { contents, dataRequest } = this.props;
    let { stepBegin, stepEnd, step } = this.state;

    if(!isEmpty(contents)){
     
      return contents.map( (e, i) => {
        this._formValid[e.step] = {form: null, rules: []};

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
                              this._formValid[e.step].rules.push({id, rule});

                            return(
                              <Selector
                                address           = { this.addressRender }
                                dataRequest       = { dataRequest }
                                handelRemoveClick = { this.props.handelRemoveClick }
                                events            = {!!this.props.events ? this.props.events : {}}
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
                    ? (<button type="button" onClick={ this.prvStep } className="m-r-15 btn btn-rounded btn-danger fcbtn btn-outline btn-1e">Lùi lại</button>)
                    : null
                  }

                  {
                    step !== stepEnd
                    ? (<button type="button" onClick={ this.nextStep(e.step)} className="btn btn-rounded btn-success fcbtn btn-outline btn-1e">Tiếp theo</button>)
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