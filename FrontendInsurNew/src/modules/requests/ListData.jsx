import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import { Loading, AlertConfirm, withNotification, Modal} from 'components';
import { actions as productDetailActions } from 'modules/productDetail';
import { rmv, isEmpty } from 'utils/functions';
import Item from './Item';
import { validate } from 'utils/validate';
import { getTimeNext } from 'utils/functions';
import { CODE } from 'config/constants';

class ListData extends Component {
  _keywordInput = null;

  constructor(props){
    super(props);
    this.state = {
      keyWord   : null,
      idCancel  : null,
      idSuccess : null
    }
  }

  componentDidMount(){
    let { productDetailActions, profile, breadcrumbActions }  = this.props;

    breadcrumbActions.set({
      page_name: 'Request',
      breadcrumb: [
        { name: "Request", liClass: "active" }
      ]
    });

    productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true, type: true }}},
        ],
        order: "id DESC"
      }, 0, 0, {
        and : [
          { or: [{status: 1}, {status: 3}] },
          { insur_id: profile.info.agency.id }
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

  onClickCancelProduct = (e) => this.setState({idCancel: e});

  onClickSuccessProduct = (e) => this.setState({idSuccess: e});

  onSuccessItem = () => {
    let { idSuccess } = this.state;

    let { productDetailActions } = this.props;
    let dateNow = Date.now();

    let data = {
      status    : 3,
      payDay    : getTimeNext(dateNow, 1),
      startDay  : dateNow,
      endDay    : getTimeNext(dateNow, 12),
      code      : `${CODE}${dateNow}`
    }

    productDetailActions.updateById(idSuccess, data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        this.props.notification.s('Messagse', 'Access request success')
      })
      .catch(e => this.handelError(e))
      .finally(() => this.setState({idSuccess: null}))
  }
  
  handelError = (e) => this.props.notification.e('Error', e.messagse);

  clickSendMess = () => {
    let {idCancel} = this.state;
    let messagse = (this._inputText != null) ? this._inputText.value : null;

    if(validate(this._inputText, 'str:3:500') && !!messagse){

      this.props.productDetailActions.updateById(idCancel, {status: 2, messagse})
        .then(res => {
          if(!!res.error) return Promise.reject(res.error);
          this.props.notification.s('Messagse', 'Send messagse success.');
        })
        .catch(e => this.handelError(e))
        .finally(() => this.setState({idCancel: null}))
    }
  }
  
  render() {
    let { productDetail } = this.props;
    let { data, ordered, isWorking }   = productDetail;
    let { keyWord, idSuccess, idCancel } = this.state;

    if (isWorking ) return <Loading />;

    let orderedN = ordered.filter(e => {
      let name = rmv(!!data[e].detail && !isEmpty(data[e].detail) && data[e].detail.nameCustomer ? data[e].detail.nameCustomer : "");
      return (!keyWord || name.indexOf(keyWord) !== -1);
    })

    let buttons = [
      <button key="2" onClick={() => this.setState({idCancel: null})} className="btn btn-danger btn-flat" type="submit">Canncel</button>,
      <button key="1" onClick={ this.clickSendMess } className="btn btn-success btn-flat" type="submit">Send</button>
    ];

    return (
      <Fragment>
        <Modal
          open    = { idCancel ? true : false }
          buttons = { buttons }
          header  = "Message" >
          <textarea
            ref = {e => this._inputText = e}
            className = {`form-control`}
            placeholder   = 'Message'
            rows          = {3}
            ></textarea>
        </Modal>

        {
          idSuccess
          ?
          ( 
            <AlertConfirm
              onCancel= { () => this.setState({idSuccess: null})}
              onSuccess= { this.onSuccessItem }
              title="Are you sure!"/>
          )
          : null
        }
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="p-10 p-b-0">
                <form method="post" action="#" id="filter">
                    <div>
                      <div className="col-xs-6 col-md-3 pull-right p-r-0">
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
                      <th width="100px">Thao tác</th>
                    </tr>
                  </thead>
                    <Item
                      onClickEditUser   = { this.onClickEditUser }
                      onClickDeleteUser = { this.onClickDeleteUser }
                      onClickSendCIS    = { this.onClickSendCIS }
                      onClickCancelProduct  = { this.onClickCancelProduct }
                      onClickSuccessProduct = { this.onClickSuccessProduct }
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
    productDetailActions : bindActionCreators(productDetailActions, dispatch),
    breadcrumbActions     : bindActionCreators(breadcrumbActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListData));