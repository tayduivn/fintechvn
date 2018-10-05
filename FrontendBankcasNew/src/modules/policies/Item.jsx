import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { isEmpty } from 'utils/functions';
import { convertDMY } from 'utils/format';

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
              
              if(data[e].status === 3 || isEmpty(data[e].detail)) return null;
              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">
                      {data[e].detail.nameCustomer ? data[e].detail.nameCustomer : ""}
                    </span>
                  </td>

                  <td>
                    <span className="font-medium">
                    {
                        !!data[e].product && !isEmpty(data[e].product) 
                        ? `${data[e].product.name}` : ""
                      }
                    </span>
                  </td>

                  <td className="text-center">
                    <span className="font-medium">
                      {data[e].create_at ? convertDMY(data[e].create_at) : ""}
                    </span>
                  </td>

                  <td className="text-center">
                    <span className="font-medium">
                      {
                        !!data[e].users && !isEmpty(data[e].users) 
                        ? `${data[e].users.firstname} ${data[e].users.lastname}` : ""
                      }
                    </span>
                  </td>

                  <td className="text-center">
                    <span className={`label label-${ (data[e].status && data[e].status === 1) ? (data[e].status === 2 ? 'danger' : 'info') : 'success' }`}>
                      { 
                        (data[e].status && data[e].status === 1) ? (
                          data[e].status === 2 ? 'Đã phản hồi' : "Đã gữi"
                        ) : 'Mới' 
                      }
                    </span>
                  </td>
                  
                  <td className="text-center">
                      
                    <Link to="/product/motor/11111111111" className="p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className="ti-pencil" aria-hidden="true"></i>
                    </Link>
                    
                    <button onClick={ this.onClickEditUser(e) } className="p-0 m-l-15 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
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