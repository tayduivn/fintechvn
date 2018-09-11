import * as React from 'react';
import { Modal } from 'semantic-ui-react'

class MD extends React.Component {
  
  render() {
    let { title, children, buttons, size, open, ...rest } = this.props;
    let op = open ? open : true;
    
    return (
      <Modal {...rest} size={`${size ? size : 'small'}`} open={op}>
        {
          (title ? (
            <Modal.Header style={{padding: "15px 1.5rm"}}>{title}</Modal.Header>
          ) : null)
        }
        
        {
          (children ? (
            <Modal.Content>
              {this.props.children}
            </Modal.Content>
          ) : null)
        }

        {
          ( (buttons && 'push' in buttons) ? (
            <Modal.Actions>
              {
                buttons.map( (e) => e )
              }
            </Modal.Actions>
          ) : null)
        }
      </Modal>
    );
  }
}

export default MD;
