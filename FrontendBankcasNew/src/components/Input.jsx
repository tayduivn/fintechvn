import * as React from 'react';

class Input extends React.Component {
  _selectHtml = null;

  constructor(props){
    super(props)
    this.state = { 
      defaultValue : ""
    }
  }

  onChange = (e: any) => {
    let select = (this._selectHtml != null) ? this._selectHtml.value : null;
    if(!!this.props.onChange) this.props.onChange(select);
    this.setState({defaultValue: select})
  }

  componentDidMount(){
    if( undefined !== this.props.refHTML) this.props.refHTML(this._selectHtml);
    if(!!this.props.defaultValue) this.setState({defaultValue: this.props.defaultValue})
  }

  componentWillReceiveProps(props){
    if(!!props.defaultValue) this.setState({defaultValue: props.defaultValue})
  }

  render() {

    let { refHTML, disabled, ...rest} = this.props;
    let { defaultValue } = this.state;
    
    return (

      <input
        onChange      = { this.onChange }
        value         = { defaultValue }
        ref           = { e => this._selectHtml = e }
        { ...rest } />
    );
  }
}

export default Input;
