import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import ReactToExcel from 'react-html-table-to-excel';

import { Loading } from 'components';
import { withNotification } from 'components';
import { actions as productDetailActions } from 'modules/productDetail';
import { rmv, isEmpty } from 'utils/functions';
import Item from './Item';

class ListData extends Component {
  _keywordInput = null;

  constructor(props){
    super(props);
    this.state = {
      keyWord   : null,
      idDelete  : null
    }
  }

  componentDidMount(){
    let { productDetailActions, profile }  = this.props;
    productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true, type: true }}},
        ],
        order: "id DESC"
      }, 0, 0, {agency_id: profile.info.agency.id}
    );
  }

  onChangeKeyword = () => {
    let keyWord = (!!this._keywordInput) ? this._keywordInput.value : "";
  
    if(keyWord.trim().length >= 0 && keyWord.trim().length < 200){
      keyWord = rmv(keyWord);
      this.setState({keyWord});
    }
  }
  
  render() {
    let { productDetail, t } = this.props;
    let { data, ordered, isWorking }   = productDetail;
    let { keyWord } = this.state;

    if (isWorking ) return <Loading />;

    let orderedN = ordered.filter(e => {
      let name = rmv(!!data[e].detail && !isEmpty(data[e].detail) && data[e].detail.nameCustomer ? data[e].detail.nameCustomer : "");
      return (!keyWord || name.indexOf(keyWord) !== -1);
    })

    return (
      <Fragment>
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="p-10 p-b-0">
                <div className="col-md-7 pull-left">
                  <ReactToExcel
                    className   = "btn btn-flat btn-info"
                    filename    = "List policies"
                    sheet       = "Sheet 1"
                    buttonText  = {t('policies:exportExcel')}
                    table       = "listPolicies" />
                    
                </div>
                <div className="col-md-5 pull-right">
                  <form method="post" action="#" id="filter">
                    <div >
                      <div className="col-xs-12 ">
                        <input
                          onChange      = { this.onChangeKeyword }
                          placeholder   = "Enter keyword"
                          ref           = { e => this._keywordInput = e} 
                          className     = "form-control" />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="clear"></div>
              </div>
              <hr style={{marginTop: '10px'}}/>
              <div className="table-responsive">
                <table id="listPolicies" className="table table-hover manage-u-table">
                  <thead>
                    <tr>
                      <th width="100px">{t('policies:tableCode')}</th>
                      <th>{t('policies:tableNameCus')}</th>
                      <th width="150px">{t('policies:tableBegin')}</th>
                      <th width="150px">{t('policies:tableEnd')}</th>
                      <th width="100px">{t('policies:tableProduct')}</th>
                      <th width="100px">{t('policies:tablePrice')}</th>
                      <th width="100px" >{t('policies:tableCreateAt')}</th>
                      <th width="100px">{t('policies:tableAction')}</th>
                    </tr>
                  </thead>
                    <Item
                      onClickEditUser   = { this.onClickEditUser }
                      onClickDeleteUser = { this.onClickDeleteUser }
                      data              = { data }
                      ordered           = { orderedN }/>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  let { productDetail, profile } = state;
  return { productDetail, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productDetailActions : bindActionCreators(productDetailActions, dispatch)
  };
};

export default withNotification(translate(['policies'])(connect(mapStateToProps, mapDispatchToProps)(ListData)));