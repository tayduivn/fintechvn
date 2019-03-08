import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';

import { withNotification, Loading } from 'components';
import { actions as productDetailActions } from 'modules/productDetail';
import { actions as settingActions } from 'modules/setting';
import { Error404 } from 'modules';

import './pdf.css';

class PrintData extends Component {
  _policiesPrint = null;

  constructor(p){
    super(p);
    this.state = {
      working: true,
    }
  }

  componentWillMount(){
    let { productDetailActions, profile, settingActions }  = this.props;
    productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true, type: true }}},
          {relation: "agency", scope: { fields: { name: true }}},
        ],
        order: "id DESC"
      }, 0, 0, {agency_id: profile.info.agency.id}
    );

    settingActions.fetchAll(null, 0, 0, { type: "provision", insur_id: profile.info.agency.insur_id});

  }

  render() {
    let { productDetail, match, setting } = this.props;
    let { id } = match.params;

    if(!!productDetail.isWorking || setting.isWorking ) return <Loading />;

    let dataPrint = productDetail.data[id];
    if(!dataPrint || dataPrint.status !== 3 || dataPrint.product.type !==  'motor') return <Error404 />;

    return (
      <div id="policiesPrint">
        {
          !!dataPrint.filePDF && dataPrint.filePDF !== "" ?
          (
            <div  id="tool" className={`tool`}>
              <iframe title="sameorigin" src={ dataPrint.filePDF }></iframe>
            </div>
          ) : null
        }

        {/* { this.renderPrint({dataPrint, provision}) } */}
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  let { productDetail, profile, setting } = state;
  return { productDetail, profile, setting };
};

let mapDispatchToProps = (dispatch) => {
  return {
    productDetailActions : bindActionCreators(productDetailActions, dispatch),
    settingActions : bindActionCreators(settingActions, dispatch),
  };
};

export default withNotification(translate(['policies'])(connect(mapStateToProps, mapDispatchToProps)(PrintData)));
