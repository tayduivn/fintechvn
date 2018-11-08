import React, { Component } from 'react';

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
              if(!data[e] || data[e].removed === 1) return null;

              let { min, max } = data[e];
              let name = `From ${min} to under ${max} year`
              
              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">{name}</span>
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