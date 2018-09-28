import React, { Component } from 'react';

import { RangeSilder } from 'components';

import { MIN_YEAR, MAX_YEAR } from 'config/constants';

class FormAdd extends Component {
  _nameInput          = null;
  _pathInput          = null;
  _channelTypeSelect  = null;
  _statusSelect       = null;
  _formData           = null;
  
  constructor(props){
    super(props);
    this.state = {
      channelID   : null,
      agencyID    : null,
      minValue    : MIN_YEAR,
      maxValue    : 0,
    }
  }
  

  onSubmitData = (e) => {
    e.preventDefault();

    let { maxValue, minValue } = this.state;

    if(maxValue > minValue)
      if(!!this.props.formSubmitData) this.props.formSubmitData({max: maxValue, min: minValue });
  }

  componentDidMount(){
    let { dataGroup, maxYear } = this.props;
    let { maxValue } = this.state;

    if(!!dataGroup){
      let { min, max } = dataGroup;
      this.setState({ minValue  : min, maxValue  : max });
    }

    if(maxYear > 0) maxValue = maxYear;
    this.setState({ minValue  : maxYear, maxValue });
    
  }

  render() {
    
    return (
      <form ref={e => this._formData = e} onSubmit={ this.onSubmitData } className="form-horizontal" style={{paddingBottom: '20px'}}>
        <div className="form-group">
          <div className="col-xs-12">
            <label>Year</label>
            <RangeSilder 
              maxValue={MAX_YEAR}
              minValue={this.state.minValue}
              value={this.state.maxValue}
              onChange= { maxValue => this.setState({maxValue}) }/>
          </div>
        </div>

        <div className="form-actions m-t-30">
          <button type="submit" className="btn btn-flat btn-outline btn-info"><i className="fa fa-check"></i> Save</button>
          <button onClick={this.props.onClose} type="button" className="right-side-toggle btn-flat btn-outline btn btn-danger m-l-15">Cancel</button>
          <div className="clear"></div>
        </div>

      </form>
    );
  }
}


export default FormAdd;