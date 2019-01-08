import React, { Component } from 'react';

class FormAccess extends Component {

  
  render() {
    let { dataValue } = this.props;
    if(!dataValue) return null;
    
    return (
        <form ref={ e => this.props._formAccess(e) }>
          <div className="form-group m-b-15">
            <label htmlFor="code" className="col-sm-2 control-label m-t-5">Code</label>
            <div className="col-md-10">
              <input
                className     = {`form-control`}
                placeholder   = 'Code'
                id            = "code"
                ref           = { e => this.props._codeText(e) }  />
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="form-group m-b-15">
            <label htmlFor="code" className="col-sm-2 control-label m-t-5">Note VCX</label>
            <div className="col-md-10">
              <input
                className     = {`form-control`}
                placeholder   = 'Note VCX'
                id            = "noteVCX"
                ref           = { e => this.props._noteVCXText(e) }  />
            </div>
            <div className="clearfix"></div>
          </div>
          {
            !!dataValue.detail && !!dataValue.detail.tnds && !!dataValue.detail.tnds.feeTnds && (
              <div className="form-group m-b-15">
                <label htmlFor="code" className="col-sm-2 control-label m-t-5">Note TNDS</label>
                <div className="col-md-10">
                  <input
                    className     = {`form-control`}
                    placeholder   = 'Note TNDS'
                    id            = "noteTNDS"
                    ref           = { e => this.props._noteTNDSText(e) }  />
                </div>
                <div className="clearfix"></div>
              </div>
            )
          }
          <div className="clearfix"></div>
        </form>
    );
  }
}



export default FormAccess;