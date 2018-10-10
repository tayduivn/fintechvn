import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { isEmpty } from 'utils/functions';
import { convertDMY } from 'utils/format';

class Item extends Component {

  onClickSendCIS = (e) => () => {
    if(!!this.props.onClickSendCIS) this.props.onClickSendCIS(e);
  };

  onClickDeleteUser = (e) => () => {
    if(!!this.props.onClickDeleteUser) this.props.onClickDeleteUser(e);
  };

  renderAction = (data) =>{
    let { status, id } = data;
    let type = !isEmpty(data.product) ? data.product.type : "";
    return(
          status === 0 ?
          (
            <Fragment>
              <Link to={`/product/${type}/${id}`} className="p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                <i className="ti-pencil" aria-hidden="true"></i>
              </Link>
              <button onClick={ this.onClickSendCIS(id) } className="p-0 m-l-15 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
              </button>

              <button onClick={ this.onClickDeleteUser(id) } className="btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                <i className="ti-trash" aria-hidden="true"></i>
              </button>
            </Fragment>
          ) : (
            <Link to={`/product/${type}/view/${id}`} className="p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
              <i className="ti-eye" aria-hidden="true"></i>
            </Link>
          )
        
    )
  }

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
                    <span className={`label label-${ (data[e] && data[e].status !== 0) ? (data[e].status === 2 ? 'danger' : 'info') : 'success' }`}>
                      { 
                        ( data[e] && data[e].status !== 0) ? (
                          data[e].status === 2 ? 'Đã phản hồi' : "Đã gữi"
                        ) : 'Mới' 
                      }
                    </span>
                  </td>
                  
                  <td className="text-center">
                    {this.renderAction(data[e])}
                    
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