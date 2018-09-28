import * as React from 'react';

import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './RangeSilder.css';

class RangeSilder extends React.Component {

  render() {
    let {maxValue, minValue, value, ...rest} = this.props;
    return (
      <InputRange
        maxValue  = {maxValue}
        minValue  = {minValue}
        value     = {value}
        {...rest} />
    );
  }
}

export default RangeSilder;
