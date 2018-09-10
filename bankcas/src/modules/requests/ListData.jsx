import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Header, Input } from 'semantic-ui-react';

import { Loading } from 'components';
import DataTableList from './DataTableList';
import { actions as productDetailActions } from 'modules/productDetail';
import { withNotification, AlertConfirm } from 'components';
import { rmv } from 'utils/function';

class ListData extends Component {

  constructor(props){
    super(props);
    this.state = {
      keySearch : null,
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
      }, 0, 0, {created_by: profile.info.id}
    );
  }

  componentWillUpdate(nextProps){
    let { productDetail } = nextProps;
    if(productDetail.error)
      this.props.notification.e('messagse', productDetail.error.messagse.toString());
  }

  handelSearchChange = (keySearch) => {
    keySearch.trim();
    this.setState({keySearch});
  }

  handelSendCIS = (id) => () => {
    let { productDetailActions, productDetail } = this.props;
    let {detail}        = productDetail.data[id];
    let {sum_insured}   = detail;
    let price           = 0;

    if(sum_insured) price = sum_insured;
    price                 = (price * 1.5 / 12);
    price                 = parseInt(price, 10);

    productDetailActions.updateById(id, {status: 1, price})
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        this.hanndelSenCISSuccess(res);
      })
      .catch(e => this.handelError(e))
  }

  handelError = (e) => {
    this.props.notification.e('Error', e.messagse);
  }

  hanndelSenCISSuccess = (data) => {
    this.props.notification.s('Messagse', 'Update Item Success')
  }

  handelSuccessDel = (data) => {
    this.props.notification.s('Messagse', 'Delete Item Success');
    this.handelCancelDel();
  }

  handelClickDelete = (id) => () => {

    this.setState({idDelete: id})
    
  }

  handelCancelDel = () => {
    this.setState({idDelete: null})
  }

  handelSubmitDel = () => {
    let { idDelete } = this.state;
    this.props.productDetailActions.del(idDelete)
      .then(res => {
        if (res.error) return Promise.reject(res.error);
        this.handelSuccessDel(res.data);
      })
      .catch(e => this.handelError(e))
  }
  
  render() {
    let { t, productDetail, history} = this.props;
    let { keySearch, idDelete } = this.state;
    let { ordered, data } = productDetail;

    if(productDetail.ordered.isWorking === 0) return (<Loading />);
    keySearch = rmv(keySearch);
    
    ordered = ordered.filter(e => {
      let nameP     = rmv(data[e].detail.policy_holder);
      return ( ( (nameP.indexOf(keySearch) !== -1 ) || keySearch === null) && data[e].status !== 3 )
    });

    let functionData = {
      handelSendCIS: this.handelSendCIS,
      handelClickDelete: this.handelClickDelete,
      history
    }

    return (
      <Fragment>
        {
          (idDelete) ? (
            <AlertConfirm
              title = "Are you sure!"
              onCancel={ this.handelCancelDel }
              onSuccess={ this.handelSubmitDel }
            />
          ) : null
        }
        <Container style={{padding: '15px'}} fluid>
          <div>
            <Header size='huge'>{ t('requests:heading1') }</Header>
          </div>
          <div style={{ margin: '15px', marginLeft: '0', textAlign: 'right' }} >
            <Input ref={e => this._inputSearch = e} onChange={ (e,{name, value}) => this.handelSearchChange(value) } icon='search' placeholder={ t('requests:search')} />
          </div>
          <DataTableList { ...functionData }  t={ t } ordered={ ordered } data={ productDetail.data } />
        </Container>
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

export default withNotification(translate('requests')(connect(mapStateToProps, mapDispatchToProps)(ListData)));