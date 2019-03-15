import React, { Component } from 'react';

class Item extends Component {

  onClickEditUser = (e) => () => {
    if(!!this.props.onClickEditUser) this.props.onClickEditUser(e);
  };

  onClickAddGroup = (e) => () => {
    if(!!this.props.onClickAddGroup) this.props.onClickAddGroup(e);
  };

  render() {
    let { ordered, data } = this.props;


    return (
      <tbody>
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              let item = data[e];
              if(!item || !!item.removed) return null;

              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium">{item.email}</span>
                  </td>
                  <td>
                    <span className="font-medium">{`${item.firstname} ${item.lastname}`}</span>
                  </td>
                  <td className="text-center" >
                    {
                      (() => {
                        let cl  = 'info';
                        let txt = 'Admin';

                        if(!!item.account_type){
                          cl  = 'primary';
                          txt = 'Agency user'

                          if(+item.account_type === 1){
                            cl  = 'success';
                            txt = 'Agency super'
                          }
                        }
                        return (
                          <span className={`label label-${cl}`}>
                            { txt }
                          </span>
                        )
                      })()
                    }
                  </td>
                  <td>{item.channel.name}</td>
                  <td>
                    {item.agency.name}
                  </td>
                  <td className="text-center">
                    <span className={`label label-${ (item.status && item.status === 1) ? 'success' : 'danger' }`}>
                      { (item.status && item.status === 1) ? 'Active' : 'Unactive' }
                    </span>
                  </td>

                  <td className="text-center">

                    <button onClick={ this.onClickEditUser(e) } className="p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className=" ti-pencil text-success" aria-hidden="true"></i>
                    </button>
                    {
                      !!item.account_type ? (
                        <button onClick={ this.onClickAddGroup(item) } className="p-0 m-l-15 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                          <i className="fa fa-sitemap text-primary" aria-hidden="true"></i>
                        </button>
                      ) : null
                    }

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
