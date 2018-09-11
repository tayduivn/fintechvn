import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import { Loading, Error404 } from 'components';
import { withNotification } from 'components';
import { actions as productActions } from 'modules/product';
import { actions as productDetailActions } from 'modules/productDetail';


const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    width: 100,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

class Print extends Component {

  componentWillMount(){
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
  
  render() { 
    let { product, productDetail, match } = this.props;
    if(product.isWoring || productDetail.isWoring ) return (<Loading />);

    let { id } = match.params;
    let dataRequest = productDetail.data[id];
    if(!dataRequest) return (<Error404 />);
    let dataProduct = product.data[dataRequest.product_id];

    if(!dataProduct) return (<Error404 />);


    return (
      <Document style={{width: "100%", height: '500px'}}>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View style={{ backgroundColor: 'red' }} >
              <Text style={{color: '#fff', textAlign: 'center'}}>ascasc</Text>
            </View>
          </View>
        </Page>
      </Document>
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

export default withNotification(translate('product')(connect(mapStateToProps, mapDispatchToProps)(Print)));