import * as React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class RightSidebar extends React.Component {

  render() {
    let { open, onClose, children, color, title, ...rest } = this.props;
    return (
      <div {...rest} className={`right-sidebar ${ (open) ? 'shw-rside' : ''}`}>
        <div className="slimscrollright">
          <div className={`rpanel-title rpanel-title-${color ? color : ''}`}>
            <strong>{title}</strong>
            {
              (onClose) ?
                (
                  <span>
                    <i onClick={ this.props.onClose } className="ti-close right-side-toggle" />
                  </span>
                )
                : null
            }
            
          </div>
          <Scrollbars style={{ height: "100vh" }}>
            <div className="r-panel-body">
              {open ? children : null}
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default RightSidebar;
