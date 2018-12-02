import React, { Component } from 'react';

import { MIN_YEAR, MAX_YEAR } from 'config/constants';

class Item extends Component {

  onClickDeleteUser = (e) => () => {
    if(!!this.props.onClickDeleteUser) this.props.onClickDeleteUser(e);
  };

  onClickEditUser = (e) => () => {
    if(!!this.props.onClickEditUser) this.props.onClickEditUser(e);
  };

  componentDidMount(){
    if(!!this.props.maxYear) this.props.maxYear(this._minYear);
  }

  render() {
    let { ordered, data, years, carType } = this.props;

    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              let item = data[e];

              if(!item || item.removed === 1) return null;

              let idY = item.year_id ? item.year_id : null;

              let yearName = "";
              if(!!years[idY]){
                let { min, max } = years[idY];

                if(min === MIN_YEAR) yearName = `Under ${max} year`;
                else if( min >= MIN_YEAR && max <= MAX_YEAR) yearName = `From ${min} to under ${max} year`;
                else yearName = `More than ${max} year`;
              }
              

              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">{item.name ? item.name : ""}</span>
                  </td>

                  <td>
                    <span className="font-medium">
                    
                    {
                      !!carType && !!carType[item.carType]
                      ? carType[item.carType].name : null
                    }
                    </span>
                  </td>

                  <td>
                    <span className="font-medium">{yearName}</span>
                  </td>

                  <td className="text-center">
                    <span className={`label label-info`}>
                      { item.ratio ? item.ratio : 0 } %
                    </span>
                  </td>
                  
                  <td className="text-center">

                    <button onClick={ this.onClickEditUser(e) } className="p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className=" ti-pencil" aria-hidden="true"></i>
                    </button>

                    <button onClick={ this.onClickDeleteUser(e) } className="btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className="ti-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              )
            })
          )
          : null
        }
      </tbody>
    );
  }
}
export default Item;