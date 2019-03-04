import React, { Component } from 'react';
import Switch from "react-switch";

class Item extends Component {

  onClickEditUser = (e) => () => {
    if(!!this.props.onClickEditUser) this.props.onClickEditUser(e);
  };

  onClickDeleteUser = (e) => () => {
    if(!!this.props.onClickDeleteUser) this.props.onClickDeleteUser(e);
  };

  updateItemById = (id, data) => {
    if(!!this.props.updateItemById) this.props.updateItemById(id, data);
  }

  render() {
    let { ordered, data, agency, channel } = this.props;

    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              let item = data[e];
              if(!item || item.removed === 1) return null;
              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">{item.key}</span>
                  </td>

                  <td>
                    <a target="_blank" href={`${!!channel[item.channel_id] ? channel[item.channel_id].path : ""}`}>
                      <span className="font-medium">
                        {
                          !!agency[item.agency_id] ? agency[item.agency_id].name : ""
                        }
                      </span>
                    </a>
                  </td>

                  <td className="text-center">
                    <a target="_blank" href={`${!!channel[item.channel_id] ? channel[item.channel_id].path : ""}`}>
                      <span className="font-medium">
                        {
                          !!channel[item.channel_id] ? channel[item.channel_id].name : ""
                        }
                      </span>
                    </a>
                  </td>

                  <td className="text-center">
                    <label style={{display: 'flex', justifyContent: 'center'}}>
                      <Switch
                        className       = "react-switch"
                        onChange        = { status => this.updateItemById(e, {status}) }
                        checked         = { !!item.status ? true : false }
                        height          = { 20 }
                        width           = { 40 }
                        aria-labelledby = "neat-label"
                      />
                    </label>
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
