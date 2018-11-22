import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from 'react-i18next';
import * as jsPDF from 'jspdf'

import { withNotification } from 'components';
import { actions as productDetailActions } from 'modules/productDetail';

class PrintData extends Component {
  _policiesPrint = null;


  componentWillMount(){
    let { productDetailActions, profile }  = this.props;
    productDetailActions.fetchAll(
      {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true, type: true }}},
        ],
        order: "id DESC"
      }, 0, 0, {agency_id: profile.info.agency.id}
    );
  }

  
  componentDidMount(){
    let doc = new jsPDF();
    let specialElementHandlers = { 
      '.controls': function(element, renderer){
        return true;
      }
    }
  

    doc.fromHTML(this._policiesPrint, 20, 20, {
      'width': 500, 
      'elementHandlers': specialElementHandlers
    });
    // console.log(doc.validateStringAsBase64());
    // console.log(doc);
    // doc.save('aa.pdf')
  }
  
  render() {

    return (
      <div ref={ e => this._policiesPrint = e } id="policiesPrint">
          ascascascasc
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