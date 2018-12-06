import React, { Component, Fragment } from 'react';

import { isEmpty } from 'utils/functions';
import { formatPrice } from 'utils/format';

class Right extends Component {

  render() {
    let { dataRequest, t, listInfo, price, sumPrice, discount, disPrice, view,
      priceVAT, sumPriceVAT  } = this.props;
    let newListInfo = [];

    sumPrice = !!sumPrice ? sumPrice : 0;
    price     = !!price ? price : 0;
    
    for(let key in listInfo){
      let newlist = {};
      if(!isEmpty(listInfo[key]) && !listInfo[key].options) newlist = listInfo[key];

      newListInfo.push(newlist);
    }
    
    return (
      <div className="col-sm-3 p-l-0 productLeft">
        {
          !!dataRequest && dataRequest.status === 2
          ? (
            <div className="white-box bg-danger">
              <div className="col-md-12 m-t-5" style={{background: "hsla(0,0%,78%,.2)", padding: '10px'}}>
                <h3 >
                  <small className="text-white" style={{fontSize: '18px', fontWeight: '700'}}>{t('product:motor_mess')}:</small>
                  <p className="text-white" >{dataRequest.messagse ? dataRequest.messagse : ""}</p>
                </h3>
              </div>
              <div className="clear"></div>
            </div>
          )
          : null
        }

        <div className="white-box">
          <h3 className="box-title m-b-0">{t('product:motor_productDetail')}</h3>
          <ul className="wallet-list listInfoProduct">

            {
              newListInfo.map((e, i) => {
                if(isEmpty(e) || e.options) return null;
                return (
                  <li key={i}>
                    <span className="pull-left"> <strong>{!!e.lang ? (e.lang ? t(`product:${e.lang}`) : "") : (!!e.name ? e.name : "")}</strong> </span>
                    <span className="pull-right">{ undefined !== e.text ? e.text : ""}</span>
                    <div className="clear"></div>
                  </li>
                )
              })
            }

            <li>
              <span className="pull-left text-info"> <strong>{t('product:motor_right_fee')}</strong> </span>
              <span className="pull-right text-danger"><strong>{formatPrice(price, 'VNĐ', 1)}</strong></span>
              <div className="clear"></div>
            </li>
          </ul>
          <h4 style={{fontSize: '13px'}} className="box-title m-b-0">{t('product:motor_addMore')}</h4>
          <ul className="wallet-list listInfoProduct more">
              {
                (!!listInfo && !!listInfo._getRuleExtends && !!listInfo._getRuleExtends.options && !isEmpty(listInfo._getRuleExtends.options))
                ? (
                  <ul className="wallet-list listInfoProduct more">
                    {
                      Object.keys(listInfo._getRuleExtends.options).map((el, y) => {
                        
                        return (
                          <li className="p-l-30" key={y}>
                            <span className="pull-left"> 
                              <strong>
                              {listInfo._getRuleExtends.options[el].name ? listInfo._getRuleExtends.options[el].name : ""}
                              </strong> 
                            </span>
                            <span className="pull-right">
                              { undefined !== listInfo._getRuleExtends.options[el].price ? formatPrice( parseFloat(listInfo._getRuleExtends.options[el].price), 'VNĐ', 1) : "0 VNĐ"}
                            </span>
                            <div className="clear"></div>
                          </li>
                      )})
                    }
                  </ul>
                )
                : null
              }
              
          </ul>
          
          
          {
            (!!listInfo && !!listInfo._assetHouseValue && !!listInfo._assetHouseValue.options && !isEmpty(listInfo._assetHouseValue.options))
            ? (<h4 style={{fontSize: '13px'}} className="box-title m-b-0">{t('product:motor_feeAssetHouse')}</h4>)
            : null
          }

          <ul className="wallet-list listInfoProduct more">
              {
                (!!listInfo && !!listInfo._assetHouseValue && !!listInfo._assetHouseValue.options && !isEmpty(listInfo._assetHouseValue.options))
                ? (
                  <ul className="wallet-list listInfoProduct more">
                    {
                      Object.keys(listInfo._assetHouseValue.options).map((el, y) => {
                        
                        return (
                          <li className="p-l-30" key={y}>
                            <span className="pull-left"> 
                              <strong>
                              {listInfo._assetHouseValue.options[el].name ? listInfo._assetHouseValue.options[el].name : ""}
                              </strong> 
                            </span>
                            <span className="pull-right">
                              { undefined !== listInfo._assetHouseValue.options[el].price ? formatPrice( parseFloat(listInfo._assetHouseValue.options[el].price), 'VNĐ', 1) : "0 VNĐ"}
                            </span>
                            <div className="clear"></div>
                          </li>
                      )})
                    }
                  </ul>
                )
                : null
              }
          </ul>
          <ul className="wallet-list listInfoProduct more">
            <li>
              <span className="pull-left text-info"> <strong>{t('product:motor_right_sumMoney')}</strong> </span>
              <span className="pull-right text-danger"><strong>{formatPrice(sumPrice + disPrice, 'VNĐ', 1)}</strong></span>
              <div className="clear"></div>
            </li>
          </ul>

          <div className="col-md-12 p-r-0">
            <div className="checkbox checkbox-info pull-left col-md-6">
              <input
                disabled = { view }
                defaultChecked  = { !dataRequest || (!!dataRequest && !!dataRequest.detail.discount) }
                id      = { 'checkbox' }
                ref     = { el => this._discountCheckBox = el } type="checkbox" />
              <label htmlFor={'checkbox'} > {t('product:discount')} { discount } % </label>
            </div>
            <div className="pull-left col-md-6 p-t-10">
              <span className="pull-right text-danger">
                <strong className="fs-11" > {!!disPrice ? `-${formatPrice(disPrice, 'VNĐ', 1)}` : "0 VND"} </strong>
              </span>
            </div>
          </div>

          <ul className="wallet-list listInfoProduct more">
            <li>
              <span className="pull-left text-info"> <strong>{t('product:motor_right_sumMoney')}</strong> </span>
              <span className="pull-right text-danger"><strong>{formatPrice(sumPrice, 'VNĐ', 1)}</strong></span>
              <div className="clear"></div>
            </li>
          </ul>

          {
            !!priceVAT && (
              <ul className="wallet-list listInfoProduct more">
                <li>
                  <span className="pull-left text-info"> <strong>{t('product:motor_right_vat')}</strong> </span>
                  <span className="pull-right text-danger"><strong>{formatPrice(priceVAT, 'VNĐ', 1)}</strong></span>
                  <div className="clear"></div>
                </li>
              </ul>
            )
          }

          {
            !!sumPriceVAT && (
              <ul className="wallet-list listInfoProduct more">
                <li>
                  <span className="pull-left text-info"> <strong>{t('product:motor_right_money')}</strong> </span>
                  <span className="pull-right text-danger"><strong>{formatPrice(sumPriceVAT, 'VNĐ', 1)}</strong></span>
                  <div className="clear"></div>
                </li>
              </ul>
            )
          }

          <div className="col-sm-12 p-0">
            {
              (!!dataRequest && dataRequest.status === 1)
              ? (
                <Fragment>
                  <button onClick={() => this.props.setStateLocal({key: 'idCancel', value: dataRequest.id})} style={{width: '45%', marginRight: '14px'}} className="col-md-6 btn btn-flat btn-danger fcbtn btn-outline btn-1e">
                    Không chấp nhận
                  </button>
                  <button onClick={() => this.props.setStateLocal({key: 'idSuccess', value: dataRequest.id})} className="col-md-6 btn btn-flat btn-success fcbtn btn-outline btn-1e">
                    Chấp nhận
                  </button>
                </Fragment>
                )
              : null
            }
          </div>
          <div className="clear"></div>
        </div>
      </div>
    );
  }
}

export default Right;