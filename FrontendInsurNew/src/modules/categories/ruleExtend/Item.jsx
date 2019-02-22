import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Switch from "react-switch";

import _ftNumber from 'utils/number';

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

  handleStatusChange = (id, status) => () => {
    if(!!this.props.handleStatusChange) this.props.handleStatusChange(id, {status: !status});
  }

  render() {
    let { ordered, data } = this.props;

    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              let item = data[e];
              if(!item || item.removed === 1) return null;

              let type = "Permanent";
              if(!!item.countType)
                type = item.type ? "Insurance fees" : "Value car";

              return (
                <tr key={i}>
                <td className="text-center">
                    <span className="font-medium">{item.code ? item.code : ""}</span>
                  </td>
                  <td>
                    <span className="font-medium">{item.name ? item.name : ""}</span>
                  </td>

                  <td>
                    <span className="font-medium">{type}</span>
                  </td>

                  <td className="text-center">
                    <span className={`label label-info`}>
                      {
                        !item.countType
                        ? (`${_ftNumber.format(item.price, 'number')} VND`)
                        : ( `${item.ratio ? item.ratio : 0}%` )
                      }
                    </span>
                  </td>

                  <td className="text-center">
                    <Switch
                      className       = "react-switch"
                      onChange        = {this.handleStatusChange(item.id, !!item.status ? true : false )}
                      checked         = { !!item.status ? true : false }
                      height          = {20}
                      width           = {40}
                      aria-labelledby = "neat-label"
                    />
                  </td>
                  
                  <td className="text-center">

                    <Link to={`/categories/rule-extends/${e}`} className="p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className=" ti-pencil" aria-hidden="true"></i>
                    </Link>

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