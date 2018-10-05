import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import './Dropzone.css';

class DZ extends Component {

  render() {
    let { children, className, ...res } = this.props
    return (
      <Dropzone className={`Dropzone ${className ? className : ""}`} {...res}>
        {
          children 
          ? children
          : (<p className="label">Try dropping some files here, or click to select files to upload.</p>)
        }
      </Dropzone>
    );
  }
}
export default DZ;