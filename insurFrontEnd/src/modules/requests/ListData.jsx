import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Header, Input } from 'semantic-ui-react';

import { Loading } from 'components';
import DataTableList from './DataTableList';
import { actions as productDetailActions } from 'modules/productDetail';
import { withNotification, Modal } from 'components';
import { rmv, getTimeNext } from 'utils/function';

class ListData extends Component {
  _inputText = null;

  constructor(props){
    super(props);
    this.state = {
      keySearch : null,
      idCancel  : null,
      messError : false
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
      }, 0, 0, {
        and : [
          { or: [{status: 2}, {status: 1}, {status: 3}] },
          { insur_id: profile.info.agency.id }
        ]
      }
    );
  }

  handelSearchChange = (keySearch) => {
    keySearch.trim();
    this.setState({keySearch});
  }

  handelClickAccess = (id) => () => {

    let { productDetailActions } = this.props;
    let dateNow = Date.now();

    let data = {
      status    : 3,
      payDay    : getTimeNext(dateNow, 1),
      startDay  : dateNow,
      endDay    : getTimeNext(dateNow, 12),
      code      : `NH${dateNow}`
    }

    productDetailActions.updateById(id, data)
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

  handelClickCancel = (id) => () => {
    this.setState({idCancel: id})
  }

  clickSendMess = () => {
    let {idCancel} = this.state;
    let messagse = (this._inputText != null) ? this._inputText.value : null;
    messagse = messagse.trim();

    if(messagse && messagse.length > 3 && messagse.length < 500){
      this.props.productDetailActions.updateById(idCancel, {status: 2, messagse})
        .then(res => { console.log(res);
          if(res.error) return Promise.reject(res.error);
          this.hanndelSendSuccess(res);
        })
        .catch(e => this.handelError(e))
    } else this.setState({messError: true});
  }

  hanndelSendSuccess = (data) => {
    this.props.notification.s('Messagse', 'Send messagse success.');
    this.setState({idCancel: null})
  }

  
  render() {
    let { t, productDetail, history, match } = this.props;
    let { keySearch, idCancel, messError } = this.state;
    let { ordered, data } = productDetail;
    let { id } = match.params;
    if(productDetail.ordered.isWorking === 0) return (<Loading />);
    keySearch = rmv(keySearch);
    
    ordered = ordered.filter(e => {
      let nameP     = rmv(data[e].detail.policy_holder);
      return ( ( (nameP.indexOf(keySearch) !== -1 ) || keySearch === null) && ( (!id || id === data[e].product_id) && data[e].status !== 3 ) )
    });

    let functionData = {
      handelClickAccess: this.handelClickAccess,
      handelClickCancel: this.handelClickCancel,
      history
    }

    let buttons = [
      <button key="1" onClick={() => this.setState({idCancel: null})} className="btn btn-primary btn-flat" type="submit">{t('requests:btnCancelSend')}</button>,
      <button key="2" onClick={ this.clickSendMess } className="btn btn-primary btn-flat" type="submit">{t('requests:btnMessSendMess')}</button>
    ];

    return (
      <Fragment>
        {
          (idCancel) ? (
            <Modal
              title = { t('requests:messCancel') }
              buttons = {buttons}
            >
            <textarea
              ref = {e => this._inputText = e}
              className = {`form-item ${messError ? 'error': ''}`}
              placeholder   = { t('requests:messCancel') }
              rows          = {5}
              ></textarea>
              
            </Modal>
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