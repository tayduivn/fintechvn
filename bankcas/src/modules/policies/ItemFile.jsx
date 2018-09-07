import React, { Component } from 'react';
import getIcon from 'config/iconFile';

class ItemFile extends Component {

  notData = () => {
    return (
      <div className="dz-default dz-message">
        <p>No Data</p>
      </div>
    )
  }

  getIconFile = (file) => {
    let typeImage = [
      "image/jpg", "image/jpeg", "image/png", "image/gif", "image/tiff",
    ];

    if(typeImage.indexOf(file.type) !== -1) return file.url;
    return getIcon(file.type);
  }

  renderData = () => {
    let {list} = this.props;

    return list.map( (e, i) => {
      return (
       
          <div key={i} className="dz-preview dz-processing dz-success dz-complete dz-image-preview">
            <a href={e.url} target="_blank" style={{cursor: "pointer"}}>
              <div className="dz-image"><img data-dz-thumbnail alt={e.originalFilename} src={this.getIconFile(e)}  /></div>
              <div className="dz-details">
                <div className="dz-filename"><span data-dz-name="">{e.originalFilename}</span></div>
              </div>
            </a>
          </div>)
    })

    
  }
  render(){
    let {list} = this.props;
    if(!list || list.length === 0) return this.notData();
    return this.renderData();

  }
}

export default ItemFile;