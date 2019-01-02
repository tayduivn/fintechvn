import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { withNotification, Loading } from 'components';
import { actions as productDetailActions } from 'modules/productDetail';
import { actions as settingActions } from 'modules/setting';
import { Error404 } from 'modules';
import PdfMotor from './PdfMotor';

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

  printData = (_policiesPrint, dataPrint) => {
    html2canvas(_policiesPrint, {logging: false}).then( (canvas) => {
      let imgData = canvas.toDataURL("image/png");

      var imgWidth = 210; 
      var pageHeight = 323;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF('p', 'mm');
      doc.setProperties({
          title: `Bạn đang xem hợp đồng của: ${!!dataPrint && !!dataPrint.detail && !!dataPrint.detail.nameCustomer ? dataPrint.detail.nameCustomer : ""}`,
      });
      var position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      this.setState({working: false})
      document.getElementById('tool').innerHTML = `<iframe src="${doc.output('bloburl')}"></iframe>`;
    });
  }

  renderPrint = ({dataPrint, provision}) => {
    let { working } = this.state;

    return <PdfMotor 
      printData   = { this.printData }
      provision   = { provision }
      dataPrint   = {dataPrint}
      working     = {working}
      setRefHtml  = { e => this._policiesPrint = e} />
  }
  
  render() {
    let { productDetail, match, setting } = this.props;
    let { id } = match.params;
    
    if(!!productDetail.isWorking || setting.isWorking ) return <Loading />;

    let { provision } = setting.item;
    
    provision = !!provision && !!provision.extra ? provision.extra : {};

    let dataPrint = productDetail.data[id];
    if(!dataPrint || dataPrint.status !== 3) return <Error404 />

    return (
      <div id="policiesPrint">
        { this.renderPrint({dataPrint, provision}) }
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