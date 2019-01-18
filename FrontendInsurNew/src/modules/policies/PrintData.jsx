import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import html2canvas from 'html2canvas';

import { withNotification, Loading } from 'components';
import { actions as productDetailActions } from 'modules/productDetail';
import { actions as settingActions } from 'modules/setting';
import { Error404 } from 'modules';
import PdfMotor from './PdfMotor';

import { api } from 'utils';

class PrintData extends Component {
  _policiesPrint = null;

  constructor(p){
    super(p);
    this.state = {
      working: true,
    }
  }

  componentWillMount(){
    let { productDetailActions, profile, settingActions, productDetail }  = this.props;

    if(productDetail.ordered.length === 0) productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true, type: true }}},
          {relation: "agency", scope: { fields: { name: true }}}
        ],
        order: "id DESC"
      }, 0, 0, {
        and : [
          { or: [{status: 1}, {status: 3}] },
          { insur_id: profile.info.agency.id }
        ]
      }
    );

    settingActions.fetchAll(null, 0, 0, { type: "provision", insur_id  : profile.info.agency.id });

  }

  printData = (_policiesPrint, dataPrint) => {
    let { match } = this.props;
    let { id } = match.params;

    html2canvas(_policiesPrint, {logging: false}).then( (canvas) => {
      let imgData = canvas.toDataURL("image/png");

      api.productDetail.pdf(id, {pdfBase: imgData})
        .then(r => console.log(r));

      document.getElementById('tool').innerHTML = `<img src="${imgData}" />` //`<iframe src="${doc.output('bloburl')}"></iframe>`;
    });
  }

  renderPrint = ({dataPrint, provision}) => {
    let { working } = this.state;

    return 
  }
  
  render() {
    let { productDetail, match, setting } = this.props;
    let { id } = match.params;
    
    if(!!productDetail.isWorking || setting.isWorking ) return <Loading />;

    let { provision } = setting.item;
    
    provision = !!provision && !!provision.extra ? provision.extra : {};

    let dataPrint = productDetail.data[id];
    
    if(!dataPrint || dataPrint.status !== 3 || dataPrint.product.type !==  'motor') return <Error404 />;

    return (
      <div id="policiesPrint">
        {
          dataPrint.policies !== ""
          ? (<iframe src={dataPrint.policies} />)
          : <PdfMotor 
              printData   = { this.printData }
              provision   = { provision }
              dataPrint   = { dataPrint }
              // working     = { working }
              setRefHtml  = { e => this._policiesPrint = e } />
        }
        
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