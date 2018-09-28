import * as React from 'react';
import { Link } from 'react-router-dom';

class Tab extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      tabID : Date.now(),
      tabActive: null
    }
  }

  componentWillMount(){
    let { tabID } = this.state;
    this.setState({tabActive: `${tabID}-0`})
  }

  onClickTabMenu = (i) => () => {
    let { tabID, tabActiveSt } = this.state;

    let tabActive = (i >= 0) ? `${tabID}-${i}` : tabActiveSt;

    if(tabActive !== tabActiveSt) this.setState({tabActive});
  }

  renderMenu = () => {
    let { options } = this.props;
    let { tabID, tabActive } = this.state;

    if('push' in options){
      return options.map( (e, i) => {
        return (
          <li key={i} className={`tab ${ `${tabID}-${i}` === tabActive ? 'active' : ''}`}>
            <Link onClick={ this.onClickTabMenu(i)} to={`#${tabID}-${i}`} data-toggle="tab"> <span className="visible-xs">
              <i className="fa fa-home" /></span> <span className="hidden-xs">{e.label}</span>
            </Link>
          </li>
        )
      })
    }
  }

  renderChildren = () => {
    let { options } = this.props;
    let { tabID, tabActive } = this.state;

    if('push' in options){
      return options.map( (e, i) => {
        return (
          <div key={i} className={`tab-pane ${ `${tabID}-${i}` === tabActive ? 'active' : ''}`}>
            {e.children}
          </div>
        )
      })
    }
  }

  render() {
    
    return (
      <React.Fragment>
        <ul className="nav nav-tabs tabs customtab">
          {this.renderMenu()}
        </ul>

        <div className="tab-content">
          
          {this.renderChildren()}
          
        </div>
      </React.Fragment>
    );
  }
}

export default Tab;
