import React, { Component, Fragment } from 'react';
import Select from 'react-select';

import { isEmpty } from 'utils/functions';

class FormAddGroup extends Component {

  constructor(p){
    super(p);
    this.state = {
      valueMainGrop: null,
      valueSubGroup: null
    }
  }

  onSubmitData = (e) => {
    e.preventDefault();

    let { valueMainGrop, valueSubGroup } = this.state;

    let groups = {};

    if(!!valueMainGrop) groups[valueMainGrop.id] = 1;

    if(!!valueSubGroup)
      for(let e of valueSubGroup) groups[e.id] = 0;

    if(!!this.props.onSubmitData) this.props.onSubmitData(groups);
  }

  mainGroupChange = (data) => {
    let { valueSubGroup } = this.state;
    let { id } = data;
    if(!!valueSubGroup) valueSubGroup = valueSubGroup.filter(e => e.id !== id);
    this.setState({ valueMainGrop: data, valueSubGroup });
  }

  mainSubChange = (data) => {
    this.setState({valueSubGroup: data });
  }

  componentDidMount(){
    let { item, groups } = this.props;
    let valueSubGroup = null;
    let valueMainGrop = null;
    let listG         = !!item.groups && !isEmpty(item.groups) ? item.groups : null;

    if(!!listG)
      for(let i in listG){
        let g = groups.data[i];
        if(!!g && !g.removed)
          if(!!listG[i]) valueMainGrop = { label: g.name, value: i, id: i }
          else {
            if(!valueSubGroup) valueSubGroup = [];
            valueSubGroup.push({ label: g.name, value: i, id: i })
          }
      }

    this.setState({ valueSubGroup, valueMainGrop})
  }


  render() {
    let { item, groups }      = this.props;
    let { valueMainGrop, valueSubGroup } = this.state;
    let { agency } = item;

    let ontionGroups = [];

    for(let item of Object.values(groups.data)){
      if(!item.removed && agency.id === item.agency_id) ontionGroups.push({label: item.name, value: item.id,  id: item.id})
    }

    return (
      <Fragment>
        <div className="form-group m-b-15">
          <label htmlFor="name" className="col-sm-2 control-label m-t-5">Main group</label>
          <div className="col-md-10">
            <Select
              value     = { valueMainGrop }
              onChange  = { v => this.mainGroupChange(v) }
              options   = { ontionGroups }
            />
          </div>
          <div className="clearfix"></div>
        </div>

        <div className="form-group m-b-15">
          <label htmlFor="name" className="col-sm-2 control-label m-t-5">Sub group</label>
          <div className="col-md-10">
            <Select
              value     = { valueSubGroup }
              isMulti   = { true }
              onChange  = { v => this.mainSubChange(v) }
              options   = { ontionGroups.filter(e => valueMainGrop === null || e.value !== valueMainGrop.value)}
            />
          </div>
          <div className="clearfix"></div>
        </div>

        <div className="modal-footer">
          <button onClick={ this.props.close } className="btn btn-danger btn-flat" type="submit">Canncel</button>,
          <button onClick={ this.onSubmitData } className="btn btn-success btn-flat" type="submit">Submit</button>
        </div>
      </Fragment>

    );
  }
}


export default FormAddGroup;
