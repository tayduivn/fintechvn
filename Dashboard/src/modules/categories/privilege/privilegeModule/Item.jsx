import React, { Component } from 'react';

class Item extends Component {

  onClickEdit = (item) => () => {
    !!this.props.clickEditItem && this.props.clickEditItem(item);
  }

  render() {
    let { ordered, data, groupName } = this.props;
    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              let item = data[e];

              if(!item) return null;
              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">
                      {item.name}
                    </span>
                  </td>

                  <td>
                    <span className="font-medium">
                      {item.section}
                    </span>
                  </td>

                  <td>
                    <span className="font-medium">
                      { groupName }
                    </span>
                  </td>
                  
                  <td className="text-center">
                    <button onClick={ this.onClickEdit(item) } className=" p-0 m-l-15 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className="fa fa-pencil text-info" aria-hidden="true"></i>
                    </button>
                    <button onClick={ () => this.props.onDeleteItem(e) } className="data-tooltip btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className="fa fa-trash text-danger" aria-hidden="true"></i>
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
