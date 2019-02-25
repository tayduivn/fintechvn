import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, AlertConfirm } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as groupActions from './actions';
import { RightSidebar, Loading } from 'components';
import FormAdd from './Form';
import Item from './Item';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      open      : false,
      idGr      : null,
      idDelete  : null
    }
  }

  componentDidMount(){
    let { breadcrumbActions, profile, groups, groupActions } = this.props;

    breadcrumbActions.set({
      page_name: 'Groups',
      breadcrumb: [{
        name: "Groups",
        liClass: "active"
      }]
    });

    if(profile.info &&groups.ordered.length === 0){

      let where = { agency_id : profile.info.agency.id, removed : 0 };

      groupActions.fetchAll({}, 0, 0, where)
        .finally( () => this.setState({groupsFetch: true}))
    }
    
  }

  openRightSidebar = () => {
    this.setState({open: true});
  }

  closeRightSidebar = () => {
    this.setState({open: false, idGr: null});
  }

  formSubmitData = (data) => {
    let { profile, groupActions, notification} = this.props;
    let { idGr } = this.state;
    
    data.agency_id = profile.info.agency.id;

    if(!idGr) {
      groupActions.create(data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Create group success');
      })
      .catch(e => notification.e('Error', e.messagse))
      .finally( this.setState({open: false, idGr: null}))
    }
    else {
      this.updateItemById(idGr, data, 'Update group success')
    }
  }

  updateItemById = (id, data, titleS) => {
    let { groupActions, notification} = this.props;

    groupActions.updateById(id, data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', titleS);
      })
      .catch(e => notification.e('Error', e.messagse))
      .finally( this.setState({open: false, idGr: null, idDelete: null}))
  }

  onDeleteItem = () => {
    let { idDelete } = this.state;
    this.updateItemById(idDelete, {removed: 1}, 'Delete success')
  }

  onClickEditUser =  (id) => this.setState({open: true, idGr: id});

  onClickDeleteUser = (e) => this.setState({idDelete: e});

  render() {
    let { open, idGr, idDelete }  = this.state;
    let { groups } = this.props;
    let { data, ordered }   = groups;
    let dataGroup           = idGr ? data[idGr] : null;
    
    if (groups.isWorking ) return <Loading />;

    return (
      <Fragment>
        <RightSidebar
          open = {open} onClose = {this.closeRightSidebar}
          title = {`${ idGr ? "Edit" : "Create"} group`}
          color = "success" >
          <FormAdd
            dataGroup       = { dataGroup }
            formSubmitData  = { this.formSubmitData }
            onClose         = { this.closeRightSidebar } />
        </RightSidebar>

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
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="p-10 p-b-0">
                <form method="post" action="#" id="filter">
                  <Link onClick={ this.openRightSidebar } to="#" className="btn btn-success pull-right">
                    <i className="fa fa-plus" /> Create new group
                  </Link>
                  <div className="clear"></div>
                </form>
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
                    onClickEditUser   = { this.onClickEditUser }
                    onClickDeleteUser = { this.onClickDeleteUser }
                    data              = { data }
                    ordered           = { ordered } />

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
  let { groups, profile } = state;

  return { groups, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    groupActions            : bindActionCreators(groupActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));