import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { isEmpty } from 'utils/functions';
import { convertDMY, formatPrice } from 'utils/format';

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
    let { t } = this.props;

    return(
          status === 0 || status === 2 ?
          (
            <Fragment>
              <Link to={`/product/${type}/${id}`} data-tooltip={t('policies:iconEdit')} className="data-tooltip p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                <i className="ti-pencil text-info" aria-hidden="true"></i>
              </Link>
              <Link to="#" onClick={ this.onClickSendCIS(id) } data-tooltip={t('policies:iconSend')} className="data-tooltip p-0 m-l-15 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                <i className="fa fa-paper-plane-o text-warning" aria-hidden="true"></i>
              </Link>
              {
                 status === 0 && (
                    <Link to='#' onClick={ this.onClickDeleteUser(id) } data-tooltip={t('policies:iconDel')} className="data-tooltip p-r-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className="ti-trash text-danger" aria-hidden="true"></i>
                    </Link>
                 )
              }
             

            </Fragment>
          ) : (
            <Link to={`/product/${type}/view/${id}`} data-tooltip={t('policies:iconView')} className="data-tooltip p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
              <i className="ti-eye text-success" aria-hidden="true"></i>
            </Link>
          )
        
    )
  }

  render() {
    let { ordered, data, t } = this.props;

    return (
      <tbody >
        {
          ordered.length > 0
          ? (
            ordered.map( (e, i) => {
              if(data[e].status === 3 || isEmpty(data[e].detail)) return null;
              return (
                <tr key={i}>
                  <td>
                    <span className="font-medium text-bold">
                      {data[e].detail.nameCustomer ? data[e].detail.nameCustomer : ""}
                    </span>
                  </td>

                  <td>
                    <span className="font-medium label label-info label-rounded">
                      {
                        !!data[e].product && !isEmpty(data[e].product) 
                        ? `${data[e].product.name}` : ""
                      }
                    </span>
                  </td>

                  <td>
                    {
                      !!data[e].detail && !!data[e].detail.tnds && !!data[e].detail.tnds.feeTnds && (
                        <span 
                          data-tooltip={`TNDS (${formatPrice(data[e].detail.feeTnds + data[e].detail.feeTnds * data[e].detail.vat, 'VND')})`}
                          className={`text-info data-tooltip m-r-15`}>
                          <i className="fa fa-car"></i>
                        </span>
                      )
                    }

                    {
                      !!data[e].detail && !!data[e].detail.connguoi && !!data[e].detail.connguoi.fee && (
                        <span 
                          data-tooltip={`Con người (${formatPrice(data[e].detail.connguoi.fee, 'VND')})`}
                          className={`text-info data-tooltip m-r-15`}>
                          <i className="fa fa-user"></i>
                        </span>
                      )
                    }

                    {
                      !!data[e].detail && !!data[e].detail.hanghoa && !!data[e].detail.hanghoa.fee && (
                        <span 
                          data-tooltip={`Hàng hoá (${formatPrice(data[e].detail.hanghoa.fee, 'VND')})`}
                          className={`text-info data-tooltip m-r-15`}>
                          <i className="fa fa-product-hunt"></i>
                        </span>
                      )
                    }

                  </td>

                  <td className="text-center">
                    <span className="font-medium">
                      {data[e].create_at ? convertDMY(data[e].create_at) : ""}
                    </span>
                  </td>

                  <td className="text-center">
                    <span className="font-medium font-italic">
                      {
                        !!data[e].users && !isEmpty(data[e].users) 
                        ? `${data[e].users.firstname} ${data[e].users.lastname}` : ""
                      }
                    </span>
                  </td>

                  <td className="text-center">
                    <span 
                      data-tooltip={
                        !!data[e] && data[e].status === 2 && !!data[e].messagse
                        ? data[e].messagse
                        : ""
                      }
                      className={`label label-${ (data[e] && data[e].status !== 0) ? (data[e].status === 2 ? 'danger data-tooltip' : 'info') : 'success' }`}>
                      { 
                        ( data[e] && data[e].status !== 0) ? (
                          data[e].status === 2 ? t('request:statusResp') : t('request:statusSent')
                        ) : t('request:statusNew')
                      }
                    </span>
                  </td>
                  
                  <td>
                    {this.renderAction(data[e])}
                    <Link to={`/product/${!!data[e].product ? data[e].product.type : ""}/clone/${e}`} data-tooltip={t('policies:iconCopy')} className="data-tooltip btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                      <i className="fa fa-copy text-primary" aria-hidden="true"></i>
                    </Link>
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