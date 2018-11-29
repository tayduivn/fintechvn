import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { withNotification, Loading } from 'components';
import { actions as productDetailActions } from 'modules/productDetail';
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
    let { productDetailActions, profile }  = this.props;
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
  }

  printData = (_policiesPrint) => {
    html2canvas(_policiesPrint, {logging: false}).then( (canvas) => {
      let imgData = canvas.toDataURL("image/png");

      var imgWidth = 210; 
      var pageHeight = 295;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF('p', 'mm');
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

  renderPrint = (dataPrint) => {
    let { working } = this.state;

    return <PdfMotor 
      printData   = { this.printData }
      dataPrint   = {dataPrint}
      working     = {working}
      setRefHtml  = { e => this._policiesPrint = e} />
  }
  
  render() {
    let { productDetail, match } = this.props;
    let { id } = match.params;

    if(!!productDetail.isWorking) return <Loading />;

    let dataPrint = productDetail.data[id];
    if(!dataPrint || dataPrint.status !== 3) return <Error404 />

    return (
      <div id="policiesPrint">
        { this.renderPrint(dataPrint) }
      </div>
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

export default withNotification(translate(['policies'])(connect(mapStateToProps, mapDispatchToProps)(PrintData)));