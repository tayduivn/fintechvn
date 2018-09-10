import * as React from 'react';

class Select extends React.Component {
  render() {
    let {options, defaultValue, className, disabled, ...rest} = this.props;
    disabled = (disabled) ? {disabled: 'disabled'} : '';
    return (
      <select {...disabled} defaultValue={defaultValue} className={`form-control ${className}`} {...rest}>
        {
          (options.length > 0)
          ? (
            options.map( (e, i) => {
              return (<option key={i} value={e.value} >{e.text}</option>)
            } )
          )
          : null
        }
      </select>
    );
  }
}

export default Select;
