import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { isEmpty } from 'utils/functions';
import { formatPrice, convertDMY } from 'utils/format';

class Item extends Component {

  onClickSuccessProduct = (e) => () => {
    if(!!this.props.onClickSuccessProduct) this.props.onClickSuccessProduct(e);
  };

  onClickCancelProduct = (e) => () => {
    if(!!this.props.onClickCancelProduct) this.props.onClickCancelProduct(e);
  };

  renderAction = (data) =>{
    let { id } = data;
    let type = !isEmpty(data.product) ? data.product.type : "";

    return(
      <Fragment>
        <Link to={`/policies/print/${type}/${id}`} className="p-0 m-l-15 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
          <i className="fa fa-file-text-o" aria-hidden="true"></i>
        </Link>

        <Link to={`/product/${type}/${id}`} className="btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
          <i className="ti-eye" aria-hidden="true"></i>
        </Link>
      </Fragment>
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
              if(data[e].status !== 3 || isEmpty(data[e].detail)) return null;
              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">
                      {data[e].code ? data[e].code : ""}
                    </span>
                  </td>
                  <td>
                    <span className="font-medium">
                      {data[e].detail.nameCustomer ? data[e].detail.nameCustomer : ""}
                    </span>
                  </td>

                  <td>
                    <span className="font-medium">
                    { (data[e].startDay) ? convertDMY(data[e].startDay, '.') : ''}
                    </span>
                  </td>
                  <td>
                    <span className="font-medium">
                    { (data[e].endDay) ? convertDMY(data[e].endDay, '.') : ''}
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
                    { formatPrice(data[e].price ? data[e].price : 0, 'VNĐ')}
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