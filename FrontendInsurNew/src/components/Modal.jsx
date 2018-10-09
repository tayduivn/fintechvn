import * as React from 'react';

import './Modal.css';

class MD extends React.Component {
  
  render() {
    let { header, children, buttons, open, ...rest } = this.props;

    return (
      <div {...rest} id="myModal" className={`modal ${!!open ? 'fade in' : ''}`} >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              {/* <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button> */}
              <h4 className="modal-title" id="myModalLabel">{header ? header : ''}</h4>
            </div>

            {
              children
              ? (
                <div className="modal-body">
                  { children }
                </div>
              )
              : null
            }

            {
              ( (buttons && 'push' in buttons) ? (

                <div className="modal-footer">
                  {
                    buttons.map( (e) => e )
                  }
                </div>
              ) : null)
            }
            
          </div>
        </div>
      </div>
    );
  }
}

export default MD;
