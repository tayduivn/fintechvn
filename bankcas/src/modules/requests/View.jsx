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
import { formatPrice } from 'utils/format';

class View extends Component {
  _formProduct  = null;

  componentDidMount(){
    let { product, productActions, productDetail, productDetailActions, profile }  = this.props;

    if(product.ordered.length === 0) productActions.fetchAll();
    if(productDetail.ordered.length === 0) productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true }}},
        ]
      }, 0, 0, {created_by: profile.info.id}
    );

    document.title = "Product";
  }
  
  render() { 
    let { t, product, productDetail, match } = this.props;
    if(product.isWorking || productDetail.isWorking) return (<Loading />);

    let { id } = match.params;
    let dataRequest = productDetail.data[id];
    if(!dataRequest) return (<Error404 />);

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
    return (
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

export default withNotification(translate('requests')(connect(mapStateToProps, mapDispatchToProps)(View)));