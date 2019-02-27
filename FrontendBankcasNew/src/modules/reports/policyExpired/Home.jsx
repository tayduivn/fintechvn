import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactToExcel from 'react-html-table-to-excel';
import { translate } from 'react-i18next';

import { withNotification } from 'components';
import { rmv, isEmpty, getTimeNextDay } from 'utils/functions';

import { actions as productDetailActions } from 'modules/productDetail';
import Item from './Item';

class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      keyWord   : null
    }
  }

  componentDidMount(){
    let { productDetailActions, profile }  = this.props;

    let time = getTimeNextDay(Date.now(), 45);
    
    productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true, type: true }}},
        ],
        order: "id DESC"
      }, 0, 0, {
          and: [
            {agency_id: profile.info.agency.id},
            {status: 3},
            {endDay: {lte: time}}
          ]
        }
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
    let { t, productDetail } = this.props;
    let { data, ordered, isWorking }   = productDetail;
    let { keyWord } = this.state;

    let orderedN = ordered.filter(e => {
      let name = rmv(!!data[e].detail && !isEmpty(data[e].detail) && data[e].detail.nameCustomer ? data[e].detail.nameCustomer : "");
      return (!keyWord || name.indexOf(keyWord) !== -1);
    })

    return (
      <div className="row white-box">
        <div className={`col-md-12 col-lg-12 col-sm-12 ${ isWorking ? ' loading' : ''}`}>
          <div className="panel">
          <div className="p-10 p-b-0">
            <div className="col-md-7 pull-left p-l-0">
              <ReactToExcel
                className   = "btn btn-info"
                filename    = "List policies"
                sheet       = "Sheet 1"
                buttonText  = {t('policies:exportExcel')}
                table       = "listPolicies" />
                
            </div>
            <div className="col-md-5 pull-right p-r-0">
              <form method="post" action="#" id="filter">
                <div >
                  <div className="col-xs-12 p-r-0">
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
                  <th width="150px">{t('policies:tableCode')}</th>
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
                  data              = { data }
                  ordered           = { orderedN }
                  t                 = { t } />
            </table>
          </div>

          </div>
        </div>
      </div>
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

export default withNotification(translate(['policies'])(connect(mapStateToProps, mapDispatchToProps)(Home)));