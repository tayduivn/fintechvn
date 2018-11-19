import * as React from 'react';

import { Select } from 'components';

import loca from './location.json';
import { isEmpty } from 'utils/functions';

class Address extends React.Component {
  _city     = null;
  _district = null;
  _address  = null;

  constructor(props){
    super(props);
    this.state = {
      cityId      : null,
      districtId  : null,
      addressFull : null,
      address     : null,
      dataError   : {}
    }
  }

  sendData = () => {
    let { cityId, districtId, address } = this.state;
    let nameCity      = !!loca[cityId] ? loca[cityId].name : "";
    let nameDistrict  = !!loca[cityId] && !!loca[cityId].districts[districtId] ? loca[cityId].districts[districtId] : "";

    let addressFull = `${!!address ? `${address},` : ''} ${nameDistrict}, ${nameCity}`;
    
    !!this.props.data && this.props.data({
      cityId, districtId, addressFull, address
    })
  }

  componentDidUpdate(nextP, nextS){
    let { cityId, districtId, address } = this.state;
    if(cityId !== nextS.cityId || districtId !== nextS.districtId || address !== nextS.address){
      this.sendData()
    }
  }

  componentWillMount(){
    let { dataRequest } = this.props;

    let defaultValue  = (typeof dataRequest === 'string') ? {address: dataRequest} : dataRequest;

    let districtId    = (!!defaultValue && !!defaultValue.districtId ? defaultValue.districtId : "");
    let address       = (!!defaultValue && !!defaultValue.address ? defaultValue.address : "");
    let cityId        = (!!defaultValue && !!defaultValue.cityId ? defaultValue.cityId : "");
    let rules = [
      {id: "cityId", rule: "int:1"},
      {id: "districtId", rule: "int:1"}
    ];

    if(!!this.props.setRules) this.props.setRules(rules);
    !!cityId && this.setState({cityId, districtId, address})
  }

  changeCity = () => {
    if(!!this._address) this._address.value = "";
    !!this._city.value && this.setState({cityId: this._city.value, districtId: null});
    
  }

  changeDistrict = () => {
    if(!!this._address) this._address.value = "";
    !!this._district.value && this.setState({districtId: this._district.value})
  }

  changeAddess = () => {
    let { cityId, districtId } = this.state;
    let dataError = {};

    if(!cityId || !districtId){
      dataError = { cityId: true, districtId: true };
    }else if(!loca[cityId].districts[districtId]){
      dataError = { cityId: true, districtId: true };
    }

    if(isEmpty(dataError)){
      let address       = !!this._address ? this._address.value :  null;
      this.setState({address})
    }

    this.setState({dataError})
  }

  render() {
    let { id, dataRequest, disabled } = this.props;
    let { cityId, dataError } = this.state;
    let city      = {0: {text: "-- Select city ---", value: 0}};
    let district  = {0: {text: "-- Select district ---", value: 0}};
    
    let defaultValue = (typeof dataRequest === 'string') ? {address: dataRequest} : dataRequest;
    if(!isEmpty(defaultValue)){
      city      = {};
      district  = {};
    }

    for(let id in loca){
      city[id] = { text: loca[id].name, value: id };
      
      if(!!cityId && !!loca[cityId] && !!loca[cityId].districts){
        let dis = loca[cityId].districts;
        for(let idD in dis){
          district[idD] = {text: dis[idD], value: idD};
        }
      }
    }

    city      = Object.values(city);
    district  = Object.values(district);

    return (
      <React.Fragment>
        <div className={`col-xs-4 ${!!dataError.cityId ? 'has-error' : ''}`}>
          <label>Tỉnh/Thành phố</label>
          <Select
            disabled={disabled}
            id = "cityId"
            defaultValue  = { !!defaultValue && !!defaultValue.cityId ? defaultValue.cityId : ""}
            onChange      = { this.changeCity }
            refHTML       = { e => this._city = e}
            options       = { city } />
        </div>
        <div className={`col-xs-4 ${!!dataError.districtId ? 'has-error' : ''}`}>
          <label>Quận/Huyện</label>
          <Select
            defaultValue  = { !!defaultValue && !!defaultValue.districtId ? defaultValue.districtId : ""}
            onChange      = { this.changeDistrict }
            refHTML       = { e => this._district = e}
            disabled      = { disabled }
            id            = "districtId"
            options       = { district } />
        </div>
        <div className="col-xs-4">
          <label>Địa chỉ</label>
          <input
            defaultValue = { !!defaultValue && !!defaultValue.address ? defaultValue.address : ""}
            id={ id ? id : ""}
            ref={e => this._address = e}
            onChange={ this.changeAddess }
            disabled={disabled}
            className="form-control" />
        </div>
      </React.Fragment>
        
    );
  }
}

export default Address;
