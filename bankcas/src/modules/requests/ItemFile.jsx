import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import getIcon from 'config/iconFile';

class ItemFile extends Component {

  notData = () => {
    return (
      <div className="dz-default dz-message">
        <p>Drop files here to upload</p>
      </div>
    )
  }

  handelRemoveClick = (name) => () => {
    this.props.handelRemoveClick(name);
  }

  getIconFile = (file) => {
    let typeImage = [
      "image/jpg", "image/jpeg", "image/png", "image/gif", "image/tiff",
    ];

    if(typeImage.indexOf(file.type) !== -1) return file.url;
    return getIcon(file.type);
  }

  renderData = () => {
    let {list, disable} = this.props;

    return list.map( (e, i) => {
      return (<div key={i} className="dz-preview dz-processing dz-success dz-complete dz-image-preview">
        
        <a href={e.url} target="_blank" style={{cursor: "pointer"}}>
          <div className="dz-image">
            <img data-dz-thumbnail alt="606500.jpg" src={this.getIconFile(e)}  />
          </div>
          <div className="dz-details">
            <div className="dz-filename"><span data-dz-name="">{e.originalFilename}</span></div>
          </div>
        </a>
        
        {
          ( (!disable) ? (<Link onClick={this.handelRemoveClick(e.name)} className="dz-remove" to="#" data-dz-remove>Remove file</Link>) : null)
        }
        
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