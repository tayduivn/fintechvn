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
import { formatPrice, convertDMY } from 'utils/format';

class View extends Component {

  componentDidMount(){
    let { product, productActions, productDetail, productDetailActions, profile }  = this.props;

    if(product.ordered.length === 0) productActions.fetchAll();
    if(productDetail.ordered.length === 0) productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true }}},
        ],
        order: "id DESC"
      }, 0, 0, {agency_id: profile.info.agency.id}
    );

    document.title = "Product";
  }
  
  render() { 
    let { t, product, productDetail, match } = this.props;
    if(product.isWorking || productDetail.ordered.length === 0) return (<Loading />);

    let { id } = match.params;
    let dataRequest = productDetail.data[id];
    let dataProduct = product.data[dataRequest.product_id];

    if(!dataProduct || !dataRequest) return (<Error404 />);

    let panes = [
      { menuItem: t('policies:tabProduct'), render: () => (
        <Tab.Pane>
          <FormData dataRequest={dataRequest} data={dataProduct} t={ t } />
        </Tab.Pane>)},
      { menuItem: t('policies:tabFile'), render: () => (
        <Tab.Pane>
          <File dataRequest={dataRequest} t={ t } />
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
                  <Header as='h4'>{t('policies:premium')}</Header>
                  <h2 className="text-right priceFinal"> {formatPrice(dataRequest.price)}
                    <sup className="h5">VND</sup>
                  </h2>
                </Segment>
              <Segment>
                  
                <Grid columns={2} divided >
                  <Grid.Row stretched>
                    <Grid.Column className="text-center p-5">
                      <label className="control-label">{t('policies:startDate')}</label>
                      <p className="form-control-static">{ (dataRequest.startDay) ? convertDMY(dataRequest.startDay, '.') : ''}</p>
                    </Grid.Column>
                    <Grid.Column className="text-center endDay">
                      <label className="control-label">{t('policies:endDate')}</label>
                      <p className="form-control-static">{(dataRequest.endDay) ? convertDMY(dataRequest.endDay, '.') : ''}</p>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <Grid className="m-t-0 policy" columns={1} divided>
                  <Grid.Row stretched>
                    <Grid.Column className="p-0 text-center">
                      <small>{t('policies:payDate')}</small>
                      <div className="deadline">{(dataRequest.payDay) ? convertDMY(dataRequest.payDay, '.') : ''}</div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

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

export default withNotification(translate('policies')(connect(mapStateToProps, mapDispatchToProps)(View)));