import React, { Component } from 'react';
import {  Container, Grid, Tab, Form, Header, Segment } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Loading, Error404 } from 'components';
import { withNotification } from 'components';
import { actions as productActions } from 'modules/product';
import { actions as productDetailActions } from 'modules/productDetail';
import FormData from './Form';
import File from './File';
import $ from 'jquery';
import { checkData } from 'libs/checkData';
import { formatPrice } from 'utils/format';

class Edit extends Component {
  constructor(props){
    super(props);
    this.state = {
      price: null
    }
  }

  componentDidMount(){
    let { product, productActions, productDetail, productDetailActions, profile }  = this.props;

    if(product.ordered.length === 0) productActions.fetchAll();
    if(productDetail.ordered.length === 0) productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true }}},
        ]
      }, 0, 0, {agency_id: profile.info.agency.id}
    );

    document.title = "Product";
  }
  
  handleError = (error) => {
    let { notification } = this.props;
    notification.e('Error', error.messagse);
  }

  handleSuccess = (data) => {
    this.props.history.push(`/requests/edit/${data.id}`);
  }

  handelSendCIS = () => {
    let { match, productDetailActions, productDetail } = this.props;
    let { id }        = match.params;
    let { detail }    = productDetail.data[id];
    let {sum_insured} = detail;
    let price = 0;

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

  handelgetPrice = () => {
    let price = $('input[name=sum_insured]').val();
    price = parseInt(price, 10);
    if(price > 0){
      price = (price * 1.5 / 12);
      price = parseInt(price, 10);
      this.setState({price});
    }
  }

  hanndelSenCISSuccess = (res) => {
    if(res.data){
      this.props.history.push(`/requests/view/${res.data.id}`);
    }
  }

  handelError = (e) => {
    this.props.notification.e('Error', e.messagse);
  }

  hanndelSenUpdateSuccess = (res) => {
    if(res.data){
      this.props.notification.s('Messagse','Update seccess.');
    }
  }

  handelSubmitProduct = () => {
    let result = checkData('formProduct');

    if(result.error.length === 0){

      let { match, productDetailActions } = this.props;
      let { id } = match.params;

      productDetailActions.updateById(id, {detail: {...result.data}})
        .then(res => {
          if(res.error) return Promise.reject(res.error);
          this.hanndelSenUpdateSuccess(res);
        })
        .catch(e => this.handelError(e));
    };
    
  }

  getPrice = () => {
    let { price } = this.state;
    let { t } = this.props;

    if( price && price > 0){
      return (
      <h2 style={{fontSize: '30px'}} className="text-right priceFinal">
        {formatPrice(price, '')}
        <sup className="h5"> VND / năm</sup>
      </h2>)
    }
    return (
      <p className="text-right">
        <i>{t('requests:pleasePrice')}</i>
      </p>
    )
  }

  render() { 
    let { t, product, productDetail, match, productDetailActions, notification } = this.props;
    
    if(product.isWorking || productDetail.isWorking) return (<Loading />);

    let { id } = match.params;
    let dataRequest = productDetail.data[id];
    if(!dataRequest) return (<Error404 />);

    let dataProduct = product.data[dataRequest.product_id];

    if(!dataProduct || dataRequest.status === 1 || dataRequest.status === 2) return (<Error404 />);

    let panes = [
      { menuItem: t('requests:tabProduct'), render: () => (
        <Tab.Pane>
          <FormData action="edit" dataRequest={dataRequest} data={dataProduct} t={ t } />
        </Tab.Pane>)},
      { menuItem: t('requests:tabFile'), render: () => (
        <Tab.Pane>
          <File 
            dataRequest={dataRequest}
            notification={notification}
            productDetailActions={productDetailActions}
            t={ t } />
        </Tab.Pane>)}
    ]
    return (
      <Form method="post" id="formProduct" onSubmit={this.handelSubmitProduct}>
        <Container style={{padding: '15px'}} fluid>
          <Grid columns={2} divided>
            <Grid.Row>
              <Grid.Column  width={12} >
                <Tab panes={panes} />
              </Grid.Column>
              <Grid.Column width={4}>
                <Segment style={{marginBottom: '2px'}} className="product-price">
                  <Header as='h4'>{t('requests:premium')}</Header>
                  {this.getPrice()}
                </Segment>
                <button type="button" onClick={this.handelgetPrice} className="btn btn-primary btn-block btn-flat"> <i style={{marginRight: '5px'}} className="fa fa-usd" ></i>{t('requests:getPriect')}</button>
                <button type="submit" className="btn btn-primary pull-right m-t-5 btn-flat"> <i style={{marginRight: '5px'}} className="fa fa-floppy-o" ></i> {t('requests:btnSave')}</button>
                <button onClick={this.handelSendCIS} type="button" className="btn btn-primary pull-right m-t-5 m-r-15 btn-flat"> <i style={{marginRight: '5px'}} className="fa fa-paper-plane-o" ></i>{t('requests:btnSendCIS')}</button>
                
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Form>
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

export default withNotification(translate('requests')(connect(mapStateToProps, mapDispatchToProps)(Edit)));