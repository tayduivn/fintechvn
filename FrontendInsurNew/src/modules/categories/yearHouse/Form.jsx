import React, { Component } from 'react';

import { RangeSilder } from 'components';
import { MIN_YEAR, MAX_YEAR } from 'config/constants';
import { isEmpty } from 'utils/functions';

class FormAdd extends Component {
  _formData           = null;
  
  constructor(props){
    super(props);
    this.state = {
      value: {
        min: 0,
        max: 10
      }
    }
  }
  

  onSubmitData = (e) => {
    e.preventDefault();

    let { value } = this.state;

    if(!!value && !isEmpty(value))
      if(!!this.props.formSubmitData) this.props.formSubmitData(value);
  }

  componentDidMount(){
    let { dataGroup } = this.props;

    if(!!dataGroup){
      let { min, max } = dataGroup;
      this.setState({ value  : {min, max} });
    }
  }

  render() {
    
    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Year</label>
            <RangeSilder 
              maxValue  = { MAX_YEAR }
              minValue  = { MIN_YEAR }
              value     = { this.state.value }
              onChange  = { e => this.setState({value: e}) } />
          </div>
        </div>

        <div className="form-actions m-t-30">
          <button type="submit" className="btn btn-flat btn-outline btn-info"><i className="fa fa-check"></i> Save</button>
          <button onClick={ this.props.onClose } type="button" className="right-side-toggle btn-flat btn-outline btn btn-danger m-l-15">Cancel</button>
          <div className="clear"></div>
        </div>

      </form>
    );
  }
}

export default FormAdd;