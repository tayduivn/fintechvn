import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Loading, AlertConfirm, withNotification} from 'components';
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
    let { productDetail, productDetailActions, profile }  = this.props;
    if(productDetail.ordered.length === 0) productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true }}},
        ]
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

  onClickDeleteUser = (e) => this.setState({idDelete: e});

  onDeleteItem = () => {
    let { idDelete } = this.state;
    this.props.productDetailActions.del(idDelete)
      .then(res => {
        if (res.error) return Promise.reject(res.error);
        this.handelSuccessDel(res.data);
      })
      .catch(e => this.handelError(e))
  }

  handelSuccessDel = (data) => {
    this.props.notification.s('Messagse', 'Delete Item Success');
    this.setState({idDelete: null})
  }

  onClickSendCIS = (id) => {
    let { productDetailActions } = this.props;

    productDetailActions.updateById(id, {status: 1})
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        this.hanndelSenCISSuccess(res);
      })
      .catch(e => this.handelError(e))
  }

  hanndelSenCISSuccess = (data) => {
    this.props.notification.s('Messagse', 'Send CIS Success')
  }

  handelError = (e) => {
    this.props.notification.e('Error', e.messagse);
  }
  
  render() {
    let { productDetail } = this.props;
    let { data, ordered, isWorking }   = productDetail;
    let { keyWord, idDelete } = this.state;

    if (isWorking ) return <Loading />;

    let orderedN = ordered.filter(e => {
      let name = rmv(!!data[e].detail && !isEmpty(data[e].detail) && data[e].detail.nameCustomer ? data[e].detail.nameCustomer : "");
      return (!keyWord || name.indexOf(keyWord) !== -1);
    })

    return (
      <Fragment>
        {
          idDelete
          ?
          ( 
            <AlertConfirm
              onCancel= { () => this.setState({idDelete: null})}
              onSuccess= { this.onDeleteItem }
              title="Are you sure!"/>
          )
          : null
        }
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="p-10 p-b-0">
                <form method="post" action="#" id="filter">
                    <div className="form-group">
                      <div className="col-xs-3 pull-right">
                        <input
                          onChange      = { this.onChangeKeyword }
                          placeholder   = "Enter keyword"
                          ref           = { e => this._keywordInput = e} 
                          className     = "form-control" />
                      </div>
                    </div>
                    <div className="clear"></div>
                  </form>
              </div>
              <hr style={{marginTop: '10px'}}/>
              <div className="table-responsive">
                <table className="table table-hover manage-u-table">
                  <thead>
                    <tr>
                      <th>Tên khách hàng</th>
                      <th width="200px">Sản phẩm</th>
                      <th className="text-center" width="150px" >Ngày tạo</th>
                      <th className="text-center" width="150px" >Tạo bởi</th>
                      <th className="text-center" width="150px" >Trạng thái</th>
                      <th width="100px" className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                    <Item
                      onClickEditUser   = { this.onClickEditUser }
                      onClickDeleteUser = { this.onClickDeleteUser }
                      onClickSendCIS = { this.onClickSendCIS }
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

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListData));