import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Header, Input } from 'semantic-ui-react';

import { Loading } from 'components';
import DataTableList from './DataTableList';
import { actions as productDetailActions } from 'modules/productDetail';
import { withNotification } from 'components';
import { rmv } from 'utils/function';

class ListData extends Component {

  constructor(props){
    super(props);
    this.state = {
      keySearch: null
    }
  }

  componentDidMount(){
    let { productDetail, productDetailActions, profile }  = this.props;
    
    if(productDetail.ordered.length === 0) productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true }}},
        ],
        order: "id DESC"
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

  handelSendCIS = (id) => () => {
    this.props.productDetailActions.updateById(id, {status: 1})
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
    this.props.notification.s('Messagse', 'Delete Item Success')
  }

  handelClickDelete = (id) => () => {
    this.props.productDetailActions.del(id)
      .then(res => {
        if (res.error) return Promise.reject(res.error);
        this.handelSuccessDel(res.data);
      })
      .catch(e => this.handelError(e))
  }
  
  render() { 
    let { t, productDetail, history} = this.props;
    let { keySearch } = this.state;
    let { ordered, data } = productDetail;

    if(productDetail.isWorking) return (<Loading />);
    keySearch = rmv(keySearch);
    
    ordered = ordered.filter(e => {
      let nameP     = rmv(data[e].detail.policy_holder);
      let code      = rmv(data[e].code);
      return ( data[e].status === 3 && ( keySearch === null || ( code.indexOf(keySearch) !== -1 ) || nameP.indexOf(keySearch) !== -1 ))
    });

    let functionData = {
      handelSendCIS: this.handelSendCIS,
      handelClickDelete: this.handelClickDelete,
      history
    }

    return (
      <Container style={{padding: '15px'}} fluid>
        <div>
          <Header size='huge'>{ t('policies:heading1') }</Header>
        </div>
        <div style={{ margin: '15px', marginLeft: '0', textAlign: 'right' }} >
          <Input ref={e => this._inputSearch = e} onChange={ (e,{name, value}) => this.handelSearchChange(value) } icon='search' placeholder={ t('policies:search')} />
        </div>
        <DataTableList { ...functionData }  t={ t } ordered={ ordered } data={ productDetail.data } />
      </Container>
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

export default withNotification(translate('policies')(connect(mapStateToProps, mapDispatchToProps)(ListData)));