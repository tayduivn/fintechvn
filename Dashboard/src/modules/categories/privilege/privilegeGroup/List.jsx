import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, AlertConfirm, Modal } from 'components';
import * as privilegeGroupActions from './actions';
import { rmv } from 'utils/functions';
import Form from './Form';
import Item from './Item';

class List extends Component {
  constructor(props){
    super(props);
    this.state = {
      open      : false,
      keyWord   : null,
      loading   : false,
      idDelete  : null,
      item      : null
    }
  }

  componentDidMount(){
    let { privilegeGroupActions, privilegeGroup } = this.props;
    if(privilegeGroup.ordered.length === 0) privilegeGroupActions.fetchAll();
  }

  onChangeKeyword = () => {
    let keyWord = (!!this._keywordInput) ? this._keywordInput.value : "";
  
    if(keyWord.trim().length >= 0 && keyWord.trim().length < 200){
      keyWord = rmv(keyWord);
      this.setState({keyWord});
    }
  }

  clickCreateItem = async (data) => {
    let { privilegeGroupActions, notification } = this.props;
    let { item }  = this.state;
    let res       = {};

    this.setState({loading: true, open: false, item: null});

    if(!item)
      res= await privilegeGroupActions.create(data);
    else res= await privilegeGroupActions.updateById(item.id, data);

    if(!res.error) notification.s('Message', `${!item ? 'Create' : 'Update'} new item success`);
    else notification.e('Message', res.error.messagse || res.error.message);

    this.setState({loading: false});
  }

  onDeleteItem = async () => {
    let { idDelete } = this.state;
    let { privilegeGroupActions, notification } = this.props;

    this.setState({loading: true, idDelete: null});

    let res = await privilegeGroupActions.deleteItem(idDelete);

    if(!res.error) notification.s('Message', 'Delete new item success');
    else notification.e('Message', res.error.messagse || res.error.message);

    this.setState({loading: false});
    
  }

  clickEditItem = (item) => this.setState({item, open: true});

  render() {
    let { open, keyWord, loading, idDelete, item }            = this.state;
    let { privilegeGroup }  = this.props;
    let { data, ordered, isWorking }   = privilegeGroup;

    let orderedN = ordered.filter(e => {
      let name = rmv(!!data[e].name ? data[e].name : "");
      return (!keyWord || name.indexOf(keyWord) !== -1);
    })

    let load = (!!loading || !!isWorking) ? ' loading': '';

    return (
      <Fragment>

        {
          idDelete ?
          ( 
            <AlertConfirm
              onCancel= { () => this.setState({idDelete: null})}
              onSuccess= { this.onDeleteItem }
              title="Are you sure!"/>
          ) : null
        }

        <Modal
          open    = { open }
          header  = "Info item new" >
          <Form 
            clickCreateItem = { this.clickCreateItem }
            item          = { item }
            close         = { () => this.setState({open: false}) } />
        </Modal>

        <div className={`col-md-4 col-lg-4 col-sm-4 ${load}`}>
          <div className="panel">
            <h3 className="box-title p-15 p-b-0">Privilege group list</h3>
            <div className="row" style={{padding: '15px 15px 0 15px'}}>
              <div className="col-md-7">
                <input 
                  onChange      = { this.onChangeKeyword }
                  ref           = { e => this._keywordInput = e}
                  type="text" className="form-control" placeholder="Enter key work" />
              </div>
              <div className="col-md-5">
                <Link onClick={ () => this.setState({open: true})} to="#" className="btn btn-success pull-right">
                  <i className="fa fa-plus" /> Create new
                </Link>
              </div>
            </div>

            <hr style={{marginTop: '10px'}}/>

            <div className="table-responsive">
              <table className="table table-hover manage-u-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th width="100px" className="text-center">Action</th>
                  </tr>
                </thead>
                  <Item
                    onDeleteItem      = { id => this.setState({idDelete: id}) }
                    clickEditItem     = { this.clickEditItem }
                    data              = { data }
                    ordered           = { orderedN }/>
              </table>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}


let mapStateToProps = (state) => {
  let { privilegeGroup } = state.categories;

  return { privilegeGroup };
};

let mapDispatchToProps = (dispatch) => {
  return {
    privilegeGroupActions       : bindActionCreators(privilegeGroupActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(List));
