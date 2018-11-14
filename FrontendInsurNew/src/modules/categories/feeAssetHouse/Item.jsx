import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { formatPrice } from 'utils/format';

class Item extends Component {

  onClickDeleteItem = (e) => () => {
    if(!!this.props.onClickDeleteItem) this.props.onClickDeleteItem(e);
  };

  onClickUpdateItem = (e) => () => !!this.props.onClickUpdateItem && this.props.onClickUpdateItem(e);

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

              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">{!!item.price && formatPrice(item.price, ' VNĐ')}</span>
                  </td>
                  
                  <td className="text-center">
                    <Link to={`/categories/fee-asset-house/edit/${e}`} className="btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className="ti-pencil" aria-hidden="true"></i>
                    </Link>
                    <button onClick={ this.onClickDeleteItem(e) } className="btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
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