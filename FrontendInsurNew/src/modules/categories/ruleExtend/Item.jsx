import React, { Component } from 'react';

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

  render() {
    let { ordered, data } = this.props;

    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              if(!data[e] || data[e].removed === 1) return null;
              let type = data[e].type ? "Insurance fees" : "Car fee";

              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">{data[e].name ? data[e].name : ""}</span>
                  </td>

                  <td>
                    <span className="font-medium">{type}</span>
                  </td>

                  <td className="text-center">
                    <span className={`label label-info`}>
                      { data[e].ratio ? data[e].ratio : 0 } %
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