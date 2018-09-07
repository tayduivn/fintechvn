import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import * as fileConfig from './fileConfig';
import 'dropzone/dist/min/dropzone.min.css';
import 'react-dropzone-component/styles/filepicker.css';
import ItemFile from './ItemFile';

class File extends Component {
  
  handleFileAdded = (file) => {
    let { dataRequest, productDetailActions, disable, notification } = this.props;
    let { id } = dataRequest;
    let formData = new FormData();
    formData.append('file', file);
    this.dropzone.removeFile(file);

    if(fileConfig.acceptTypeFile.indexOf(file.type) !== -1){
      if(fileConfig.maxFilesize >= file.size){
        if(!disable){
          productDetailActions.uploadFile(formData, id)
          .then(res => { 
            this.handelUploadSuccess(res)
          }, e => Promise.reject(e))
          .catch(e => this.handelError(e));
        }
      } else notification.e('Error', 'File size invalid');
    } else notification.e('Error', 'Type file invalid');
    
  }

  handelRemoveClick = (name) => {
    let { dataRequest, productDetailActions, disable } = this.props;
    let { id } = dataRequest;

    if(!disable){
      productDetailActions.removeFile(name, id)
      .then(res => {
        this.handelRemoveFileSuccess(res);
      }, e => Promise.reject(e))
      .catch(e => this.handelError(e));
    } 
  }

  handelError = (err) => {
    this.props.notification.e('Error', err.messagse);
  }

  handelRemoveFileSuccess = (data) => {
    if(!data) this.props.notification.e('Error', 'File not delete.');
    else this.props.notification.s('Messagse', 'Delete file success.');
  }

  handelUploadSuccess = (data) => {
    if(!data) this.props.notification.e('Error', 'File not update.');
    else this.props.notification.s('Messagse', 'Upload file success.');
  }

  render() {
    const eventHandlers = {
      init: dz => this.dropzone = dz,
      addedfile   : this.handleFileAdded
    }

    let { disable } = this.props;
    return (
        <DropzoneComponent 
          config={fileConfig.componentConfig}
          eventHandlers={eventHandlers}
          className={`${disable ? 'dz-disable' : ''}`}
          djsConfig={fileConfig.djsConfig} >

          <ItemFile 
            handelRemoveClick={this.handelRemoveClick}
            disable={disable}
            list={this.props.dataRequest.file} />
        </DropzoneComponent>
    );
  }
}

export default File;