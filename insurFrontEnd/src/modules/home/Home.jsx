import React, { Component } from 'react';
import { Header, Container, Grid, Segment, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Loading } from 'components';
import { actions as productActions } from 'modules/product';
import { withNotification } from 'components';

class Home extends Component {

  componentDidMount(){
    let { product, productActions }  = this.props;
    if(product.ordered.length === 0) productActions.fetchAll();
  }

  renderProduct = () => {
    let { product }  = this.props;
    if(product.ordered.length > 0){
      return product.ordered.map( (e, i) => {
        
        return (<Grid.Column className="product-box" key={i} floated='right' width={5} >
            <Link to={`/requests/${e}`} >
              <Segment textAlign='center' className="linkProduct">
                <Header size='tiny'> <Icon name={product.data[e].icon} /></Header>
                <Header style={{ marginTop: '0'}} size='tiny'>{product.data[e].name}</Header>
              </Segment>
            </Link>
          </Grid.Column>);
      })
    }
    return null;
  }

  render() {
    let { t, product } = this.props; 
    if(product.isWorking) return (<Loading />);
    return (
      <div>
        <Header as='h2' icon textAlign='center'>
          <Header.Content>{ t('home:titlelv1') }</Header.Content>
        </Header>
        <Header style={{ marginTop: '0'}} as='h4' icon textAlign='center'>
          <Header.Content>{ t('home:titlelv2') }</Header.Content>
        </Header>
        <Container>
          <Grid columns={2} divided>
            <Grid.Row className="product-row">
              {this.renderProduct()}
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { product } = state;
  return { product };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productActions : bindActionCreators(productActions, dispatch)
  };
};

export default withNotification(translate('home')(connect(mapStateToProps, mapDispatchToProps)(Home)));