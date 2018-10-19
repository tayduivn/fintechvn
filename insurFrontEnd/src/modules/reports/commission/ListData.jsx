import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Header, Input, Icon } from 'semantic-ui-react';

import { Loading } from 'components';
import DataTableList from './DataTableList';
import { actions as productDetailActions } from 'modules/productDetail';
import { withNotification } from 'components';
import { rmv } from 'utils/function';
import { Link } from 'react-router-dom';

class ListData extends Component {

  constructor(props){
    super(props);
    this.state = {
      keySearch: null
    }
  }

  componentDidMount(){
    let { productDetail, productDetailActions }  = this.props;
    if(productDetail.ordered.length === 0) productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true }}},
        ],
        order: "id DESC"
      }, 0, 0, {or : [{status: 2}, {status: 1}, {status: 3}] }
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
      return ( ((nameP.indexOf(keySearch) !== -1 ) || keySearch === null))
    });

    let functionData = {
      handelSendCIS: this.handelSendCIS,
      handelClickDelete: this.handelClickDelete,
      history
    }

    return (
      <Container style={{padding: '15px'}} fluid>
        <div>
          <Header className="pull-left" size='huge'>{ t('report:headingCommission') }</Header>
          <div className="pull-right">
            <Link to="/reports" className="btn btn-primary" >
              { t('report:Menucommission') }
            </Link>
            <Link to="/reports/revenue" className="btn btn-primary m-l-5" >
              { t('report:MenuRevenue') }
            </Link>
            <Link to="/reports/policyExpired" className="btn btn-primary m-l-5" >
              { t('report:MenuPolicyExpired') }
            </Link>
          </div>
          <div className="clear"></div>
        </div>
        <div style={{ margin: '15px', marginLeft: '0'}} >
          <div className="pull-left">
            <button className="btn btn-primary" type="submit">
              <Icon name="filter" />
              { t('report:excel') }
            </button>
          </div>
          <Input className="pull-right m-b-15" ref={e => this._inputSearch = e} onChange={ (e,{name, value}) => this.handelSearchChange(value) } icon='search' placeholder={ t('policies:search')} />
        </div>
        <div className="clear"></div>
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

export default withNotification(translate('report')(connect(mapStateToProps, mapDispatchToProps)(ListData)));