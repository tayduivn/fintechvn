import React, { Component } from 'react';

class Item extends Component {

  onClickEditUser = (e) => () => {
    if(!!this.props.onClickEditUser) this.props.onClickEditUser(e);
  };

  onClickDeleteUser = (e) => () => {
    if(!!this.props.onClickDeleteUser) this.props.onClickDeleteUser(e);
  };

  render() {
    let { ordered, data } = this.props;

    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              if(data[e].removed === 1) return null;
              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">{data[e].name}</span>
                  </td>

                  <td>
                    <a target="_blank" href={data[e].path}>
                      <span className="font-medium">{data[e].path}</span>
                    </a>
                  </td>

                  <td className="text-center">
                    <span className={`label label-${ (data[e] && data[e].channel_type === 0) ? 'success' : 'info' }`}>
                      { (data[e] && data[e].channel_type === 0) ? 'Dashboard' : 'Channel' }
                    </span>
                  </td>

                  <td className="text-center">
                    <span className={`label label-${ (data[e].status && data[e].status === 1) ? 'success' : 'danger' }`}>
                      { (data[e].status && data[e].status === 1) ? 'Open' : 'Close' }
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