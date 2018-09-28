import React, { Component } from 'react';

import { MIN_YEAR, MAX_YEAR } from 'config/constants';

class Item extends Component {

  _minYear = MIN_YEAR;

  onClickDeleteUser = (e) => () => {
    if(!!this.props.onClickDeleteUser) this.props.onClickDeleteUser(e);
  };

  componentDidMount(){
    if(!!this.props.maxYear) this.props.maxYear(this._minYear);
  }

  render() {
    let { ordered, data } = this.props;

    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              if(!data[e] || data[e].removed === 1) return null;

              let { min, max } = data[e];
              let name = "";

              if(min === MIN_YEAR) name = `Under ${max} year`;
              else if( min >= MIN_YEAR && max <= MAX_YEAR) name = `From ${min} to under ${max} year`;
              else name = `More than ${max} year`;
              
              if(max > this._minYear) this._minYear = max;

              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">{name}</span>
                  </td>
                  
                  <td className="text-center">
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