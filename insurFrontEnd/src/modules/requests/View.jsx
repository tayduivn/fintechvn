import React, { Component, Fragment } from 'react';
import {  Container, Grid, Tab, Form, Header, Segment } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Loading, Error404 } from 'components';
import { withNotification, Modal } from 'components';
import { actions as productActions } from 'modules/product';
import { actions as productDetailActions } from 'modules/productDetail';
import FormData from './Form';
import File from './File';
import { formatPrice } from 'utils/format';
import { getTimeNext } from 'utils/function';

class View extends Component {
  _inputText = null;

  constructor(props){
    super(props);
    this.state = {
      idCancel  : null,
      messError : false
    }
  }

  componentDidMount(){
    let { product, productActions, productDetail, productDetailActions }  = this.props;

    if(product.ordered.length === 0) productActions.fetchAll();
    if(productDetail.ordered.length === 0) productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true }}},
        ]
      }, 0, 0, {or : [{status: 2}, {status: 1}, {status: 3}] }
    );

    document.title = "Product";
  }

  handelClickAccess = () => {

    let { productDetailActions, match } = this.props;
    let dateNow = Date.now();
    let { id } = match.params;

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
        if(!res.data) return Promise.reject({messagse: 'Upload error.'});
        this.hanndelSenCISSuccess(res.data);
      })
      .catch(e => this.handelError(e))
  }

  handelError = (e) => {
    this.props.notification.e('Error', e.messagse);
  }

  hanndelSenCISSuccess = (data) => {
    this.props.notification.s('Messagse', 'Update Item Success');
    let url = `/policies/view/${data.id}`;
    this.props.history.push(url);
  }

  handelClickCancel = () => {
    let { match } = this.props;
    let { id } = match.params;
    this.setState({idCancel: id})
  }

  clickSendMess = () => {
    let {idCancel} = this.state;
    let messagse = (this._inputText != null) ? this._inputText.value : null;
    messagse = messagse.trim();

    if(messagse && messagse.length > 3 && messagse.length < 500){
      this.props.productDetailActions.updateById(idCancel, {status: 2, messagse})
        .then(res => {
          if(res.error) return Promise.reject(res.error);
          this.hanndelSendSuccess(res);
        })
        .catch(e => this.handelError(e))
    }else this.setState({messError: true});
  }

  hanndelSendSuccess = (data) => {
    this.props.notification.s('Messagse', 'Send messagse success.');
    this.setState({idCancel: null, messError: false})
  }
  
  render() { 
    let { t, product, productDetail, match } = this.props;
    let { idCancel, messError } = this.state;
    if(product.isWorking || productDetail.isWorking) return (<Loading />);

    let { id } = match.params;
    let dataRequest = productDetail.data[id];
    if(!dataRequest || dataRequest.status === 0 || dataRequest.status === 3) return (<Error404 />);

    let dataProduct = product.data[dataRequest.product_id];
    if(!dataProduct) return (<Error404 />);

    let panes = [
      { menuItem: t('requests:tabProduct'), render: () => (
        <Tab.Pane>
          <FormData dataRequest={dataRequest} data={dataProduct} t={ t } />
        </Tab.Pane>)},
      { menuItem: t('requests:tabFile'), render: () => (
        <Tab.Pane>
          <File disable={true} dataRequest={dataRequest} t={ t } />
        </Tab.Pane>)}
    ]

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
        <Form method="post" id="formProduct" onSubmit={this.handelSubmitProduct}>
          <Container style={{padding: '15px'}} fluid>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column  width={12} >
                  <Tab panes={panes} />
                </Grid.Column>
                <Grid.Column width={4}>
                  {
                    (dataRequest && dataRequest.status === 2)
                    ? (
                      <Segment style={{marginBottom: '2px'}} className="product-mess">
                        <Header as='h4'>{t('requests:messagse')}</Header>
                        <p>{(dataRequest.messagse ? dataRequest.messagse : '')}</p>
                      </Segment>
                    )
                    : null
                  }
                  <Segment style={{marginBottom: '2px'}} className="product-price">
                    <Header as='h4'>{t('requests:premium')}</Header>
                    <h2 style={{fontSize: '30px'}} className="text-right priceFinal">
                      {formatPrice(dataRequest.price, '')}
                      <sup className="h5"> VND / năm</sup>
                    </h2>
                  </Segment>
                  <button onClick={ this.handelClickAccess } type="button" className="btn btn-primary pull-right m-t-5 btn-flat"> <i style={{marginRight: '5px'}} className="fa fa-paper-plane-o" ></i>{t('requests:access')}</button>
                  <button onClick={ this.handelClickCancel } type="submit" className="btn btn-primary pull-right m-t-5 m-r-15 btn-flat"> <i style={{marginRight: '5px'}} className="fa fa-paper-plane-o" ></i> {t('requests:cancel')}</button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Form>
      </Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  let { product, productDetail, profile } = state;
  return { product, productDetail, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productActions        : bindActionCreators(productActions, dispatch),
    productDetailActions  : bindActionCreators(productDetailActions, dispatch),
  };
};

export default withNotification(translate('requests')(connect(mapStateToProps, mapDispatchToProps)(View)));