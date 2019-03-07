import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, AlertConfirm } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as agencyActions from './actions';
import { actions as channelActions } from 'modules/categories/channel';
import { RightSidebar, Loading } from 'components';
import FormAdd from './Form';
import Item from './Item';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      open      : false,
      idUpdate      : null,
      idDelete  : null
    }
  }

  componentDidMount(){
    let { breadcrumbActions, agencyActions, channelActions } = this.props;

    breadcrumbActions.set({
      page_name: 'Agency',
      breadcrumb: [
        { name: "Categories" },
        { name: "Agency", liClass: "active" }
      ]
    });

    agencyActions.fetchAll({
      include: [
        {relation: "channel", scope: { fields: { name: true, path: true, channel_type: true}}},
      ]
    }, 0, 0, {removed: 0});

    channelActions.fetchAll({}, 0, 0, {removed: 0});

  }

  openRightSidebar = () => {
    this.setState({open: true});
  }

  closeRightSidebar = () => {
    this.setState({open: false, idUpdate: null});
  }

  formSubmitData = (data) => {
    let { agencyActions, notification} = this.props;
    let { idUpdate } = this.state;

    if(!idUpdate) {
      agencyActions.create(data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Create agency success');
      })
      .catch(e => notification.e('Error', e.messagse))
      .finally( this.setState({open: false, idUpdate: null}))
    }
    else {
      this.updateItemById(idUpdate, data, 'Update agency success')
    }
  }

  updateItemById = (id, data, titleS) => {
    let { agencyActions, notification} = this.props;
    console.log(data);
    agencyActions.updateById(id, data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', titleS);
      })
      .catch(e => notification.e('Error', e.messagse))
      .finally( this.setState({open: false, idUpdate: null, idDelete: null}))
  }

  onDeleteItem = () => {
    let { idDelete } = this.state;
    this.updateItemById(idDelete, {removed: 1}, 'Delete success')
  }

  onClickDeleteUser = (e) => this.setState({idDelete: e});

  onClickEditUser =  (id) => {
    this.setState({open: true, idUpdate: id});
  }

  render() {
    let { open, idUpdate, idDelete }  = this.state;
    let { agency, channel } = this.props;
    let { data, ordered, isWorking }   = agency;
    let dataGroup           = idUpdate ? data[idUpdate] : null;

    if (isWorking || channel.isWorking) return <Loading />;
    return (
      <Fragment>
        <RightSidebar
          open = {open} onClose = {this.closeRightSidebar}
          title = {`${ idUpdate ? "Edit" : "Create"} agency`}
          color = "success" >
          <FormAdd
            dataGroup       = { dataGroup }
            channel         = { channel }
            agency          = { agency }
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
                    <i className="fa fa-plus" /> Create new agency
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
                      <th width="200px">Channel</th>
                      <th className="text-center" width="150px" >Max user</th>
                      <th width="100px" className="text-center">Action</th>
                    </tr>
                  </thead>
                    <Item
                      onClickEditUser   = { this.onClickEditUser }
                      onClickDeleteUser = { this.onClickDeleteUser }
                      data              = { data }
                      ordered           = { ordered }/>
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
  let { agency, channel } = state.categories;

  return { agency, channel };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    channelActions          : bindActionCreators(channelActions, dispatch),
    agencyActions           : bindActionCreators(agencyActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));
