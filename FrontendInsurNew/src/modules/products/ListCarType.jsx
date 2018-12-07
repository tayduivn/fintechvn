import React, { Component,  } from 'react';
import { Link } from 'react-router-dom';

class ListCarType extends Component {

  constructor(p){
    super(p);
    this.state = {
      carTypeId :  null
    }
  }

  carTypeClick = (id) => (e) => {
    e.preventDefault();
    this.setState({carTypeId: id})
  }

  render() {
    let { carType }   = this.props;
    let { carTypeId } = this.state;

    return (
      <div className="list-group listCarType mail-list m-t-20">
        {
          !!carType && !!carType.ordered && carType.ordered.map((e, i) => {
            let item = carType.data[e];
            if(!item || !!item.removed) return null;

            return <Link 
              onClick={ this.carTypeClick(e) }
              key={i}
              className={`list-group-item ${e === carTypeId ? 'active': '' }`}
              to="#"><span>{!!item.name ? item.name : ""}</span></Link>
          })
        }
      </div>
    );
  }
}

export default ListCarType;