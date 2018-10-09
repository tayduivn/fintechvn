import React, { Component } from 'react';

import { isEmpty } from 'utils/functions';
import getIcon from 'config/iconFile';

class ItemFile extends Component {

  getIconFile = (file) => {
    let typeImage = [
      "image/jpg", "image/jpeg", "image/png", "image/gif", "image/tiff",
    ];

    if(typeImage.indexOf(file.type) !== -1) return file.url;
    return getIcon(file.type);
  }

  render() {
    let { files } = this.props;
    
    if(!files || isEmpty(files)) return null;

    return (
      <div className="fileResult">
        {files.map((e, i)=>{
          return(
            <div key={i} className="dz-preview dz-processing dz-success dz-complete dz-image-preview p-30">
              <a href={e.url} target="_blank" style={{cursor: "pointer"}}>
                <div className="dz-image">
                  <img data-dz-thumbnail alt="606500.jpg" src={this.getIconFile(e)}   />
                </div>
              </a>
            </div>
          )
        })}
        <div className="clear"></div>
      </div>
    );
  }
}

export default ItemFile;