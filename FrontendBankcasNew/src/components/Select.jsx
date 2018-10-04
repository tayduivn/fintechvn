import * as React from 'react';
import { isEmpty } from 'utils/functions';

class Select extends React.Component {
  _selectHtml = null;

  onChange = (e: any) => {
    let select = (this._selectHtml != null) ? this._selectHtml.value : null;
    if(!!this.props.onChange) this.props.onChange(select);
  }

  componentDidMount(){
    if( undefined !== this.props.refHTML) this.props.refHTML(this._selectHtml)
  }

  render() {
    let {options, defaultValue, refHTML, onChange, className, disabled, ...rest} = this.props;

    if (rest.filter instanceof Function){
      let newOption = options.filter(e => rest.filter(e));
      options = newOption;
    }

    disabled = (disabled) ? {disabled: 'disabled'} : '';
    return (
      <select ref={e => this._selectHtml = e} onChange={ this.onChange } {...disabled} defaultValue={defaultValue} className={`form-control ${(className) ? className : ''}`} {...rest}>
        {
          (options && !isEmpty(options))
          ? (
            options.map( (e, i) => {
              let { value, text, ...attr} = e;
              return (<option key={i} {...attr} value={value} >{text}</option>)
            })
          )
          : null
        }
      </select>
    );
  }
}

export default Select;
