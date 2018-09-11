import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import * as fileConfig from './fileConfig';
import 'dropzone/dist/min/dropzone.min.css';
import 'react-dropzone-component/styles/filepicker.css';
import ItemFile from './ItemFile';

class File extends Component {
  
  render() {
    const eventHandlers = {
      init        : dz => this.dropzone = dz,
    }
    return (
      <div>
        <DropzoneComponent
          config={fileConfig.componentConfig}
          className={`dz-disable`}
          eventHandlers={eventHandlers} >

          <ItemFile list={this.props.dataRequest.file} />
        </DropzoneComponent>
      </div>
    );
  }
}

export default File;