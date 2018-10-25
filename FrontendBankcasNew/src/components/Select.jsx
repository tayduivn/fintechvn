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
    let {t, options, defaultValue, refHTML, onChange, className, disabled, filter, ...rest} = this.props;

    disabled = (disabled) ? {disabled: 'disabled'} : '';

    return (
      <select ref={e => this._selectHtml = e} onChange={ this.onChange } {...disabled} defaultValue={defaultValue} className={`form-control ${(className) ? className : ''}`} {...rest}>
        {
          (options && !isEmpty(options))
          ? (
            options.map( (e, i) => {
              let { value, lang, text, ...attr} = e;
              return (<option key={i} {...attr} value={value} >
                {
                  !!t && !!lang ? (t(lang)) : text
                }
                </option>)
            })
          )
          : null
        }
      </select>
    );
  }
}

export default Select;
