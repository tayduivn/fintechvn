import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, AlertConfirm } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as ruleExtendActions from './actions';

import Item from './Item';
import { rmv } from 'utils/functions';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      open      : false,
      idDelete  : null,
      keyWord   : null
    }
  }

  componentDidMount(){
    let { breadcrumbActions, profile, ruleExtend, ruleExtendActions } = this.props;

    breadcrumbActions.set({
      page_name: 'Rule Extends',
      breadcrumb: [
        { name: "Categories" },
        { name: "Rule Extends", liClass: "active" }
      ]
    });

    let where  = { removed: 0, insur_id: profile.info.agency.id};

    if(ruleExtend.ordered.length === 0) ruleExtendActions.fetchAll(null, 0, 0, where);
    
  }

  updateItemById = (id, data, titleS) => {
    let { ruleExtendActions, notification} = this.props;

    ruleExtendActions.updateById(id, data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', titleS);
      })
      .catch(e => notification.e('Error', e.messagse))
      .finally( this.setState({open: false, idDelete: null}))
  }

  onDeleteItem = () => {
    let { idDelete } = this.state;
    this.updateItemById(idDelete, {removed: 1}, 'Delete item success')
  }

  handleStatusChange = (id, status) => {
    this.updateItemById(id, status, 'Change status item success')
  }

  onClickDeleteUser = (e) => this.setState({idDelete: e});

  onChangeKeyword = () => {
    let keyWord = (!!this._keywordInput) ? this._keywordInput.value : "";
  
    if(keyWord.trim().length >= 0 && keyWord.trim().length < 200){
      keyWord = rmv(keyWord);
      this.setState({keyWord});
    }
  }

  render() {
    let { idDelete, keyWord }  = this.state;
    let { ruleExtend } = this.props;
    let { data, ordered, isWorking }   = ruleExtend;
    
    let orderedN = ordered.filter(e => {
      let name = rmv(data[e].name);
      return (!keyWord || name.indexOf(keyWord) !== -1);
    })

    return (
      <Fragment>

        {
          idDelete
          ?
          ( 
            <AlertConfirm
              onCancel= { () => this.setState({idDelete: null})}
              onSuccess= { this.onDeleteItem }
              title="Are you sure!"/>
          )
          : null
        }

        <div className="row">
          <div className={`col-md-12 col-lg-12 col-sm-12${isWorking ? ' loading' : ''}`}>
            <div className="panel">
              <div className="p-10 p-b-0">
                <form method="post" action="#" id="filter">
                  <div className="form-group">
                    <div className="col-xs-3">
                      <input
                        onChange      = { this.onChangeKeyword }
                        placeholder   = "Enter keyword"
                        ref           = { e => this._keywordInput = e} 
                        className     = "form-control" />
                    </div>
                  </div>
                  <Link to="/categories/rule-extends/create" className="btn btn-success pull-right">
                    <i className="fa fa-plus" /> Create new item
                  </Link>
                  <div className="clear"></div>
                </form>
              </div>
              <hr style={{marginTop: '10px'}}/>
              <div className="table-responsive">
                <table className="table table-hover manage-u-table">
                  <thead>
                    <tr>
                      <th className="text-center" width="50px">Code</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th width="200px" className="text-center">Ratio</th>
                      <th width="100px" className="text-center">Status</th>
                      <th width="100px" className="text-center">Action</th>
                    </tr>
                  </thead>
                    <Item
                      onClickEditUser   = { this.onClickEditUser }
                      onClickDeleteUser = { this.onClickDeleteUser }
                      handleStatusChange= { this.handleStatusChange }
                      data              = { data }
                      maxYear           = { max => this.setState({maxYear: max}) }
                      ordered           = { orderedN }/>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

let mapStateToProps = (state) => {
  let { ruleExtend } = state.categories;
  let { profile } = state;

  return { profile, ruleExtend };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    ruleExtendActions     : bindActionCreators(ruleExtendActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));