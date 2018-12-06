import React, { Component } from 'react';
import _ftNumber from 'utils/number';

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

              let fee   = !!item.fee ? item.fee : 0;
              let vat = !!item.vat ? item.vat : 0;

              let vatP = fee*vat/100;
              let sumP = fee + vatP;

              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">{item.name}</span>
                  </td>

                  <td>
                    <span className="font-medium">{_ftNumber.format(fee, 'number')} VND</span>
                  </td>
                  <td>
                    <span className="font-medium">{_ftNumber.format(vatP, 'number')} VND ({vat}%)</span>
                  </td>
                  <td>
                    <span className="font-medium">{_ftNumber.format(sumP, 'number')} VND</span>
                  </td>
                  
                  <td className="text-center">
                    <button onClick={ this.onClickUpdateItem(e) } className="btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className="ti-pencil" aria-hidden="true"></i>
                    </button>
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