import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, AlertConfirm, RightSidebar, Loading } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as groupActions from './actions';
import { actions as channelActions } from 'modules/categories/channel';
import { actions as agencyActions } from 'modules/categories/agency';
import { isEmpty } from 'utils/functions';

import FormAdd from './Form';
import Item from './Item';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      open      : false,
      idUpdate  : null,
      idDelete  : null,
      loading   : false
    }
  }

  async componentDidMount(){
    let { breadcrumbActions, groups, groupActions, agencyActions, channelActions } = this.props;

    this.setState({loading: true});

    breadcrumbActions.set({
      page_name: 'Groups',
      breadcrumb: [{
        name: "Groups",
        liClass: "active"
      }]
    });

    if(groups.ordered.length === 0) await groupActions.fetchAll({}, 0, 0, {removed: 0});

    await agencyActions.fetchAll({}, 0, 0, {removed: 0});
    await channelActions.fetchAll({}, 0, 0, {removed: 0});

    this.setState({loading: false});

  }

  openRightSidebar = () => {
    this.setState({open: true});
  }

  closeRightSidebar = () => {
    this.setState({open: false, idUpdate: null});
  }

  formSubmitData = async (data) => {
    let { groupActions, notification} = this.props;
    let { idUpdate } = this.state;

    if(!isEmpty(data)){
      if(!idUpdate) {

        this.setState({loading: true, open: false, idUpdate: null});

        let res = await groupActions.create(data);

        if(!!res.error) notification.e('Error', res.error.messagse || res.error.message)
        else if(!!res.data) notification.s('Messagse', 'Create item success');
        else notification.e('Error', 'Error unknown');

        this.setState({loading: false});

      }else this.updateItemById(idUpdate, data, 'Update group success')
    }else notification.e('Error', 'Data invalid')
  }

  updateItemById = async (id, data, titleS) => {
    let { groupActions, notification} = this.props;

    this.setState({loading: true, open: false, idUpdate: null, idDelete: null});

    let res = await groupActions.updateById(id, data);
    if(!!res.error) notification.e('Error', res.error.messagse || res.error.message)
    else if(!!res.data) notification.s('Messagse', titleS);
    else notification.e('Error', 'Error unknown')

    this.setState({loading: false});
  }

  onDeleteItem = () => {
    let { idDelete } = this.state;
    this.updateItemById(idDelete, {removed: 1}, 'Delete success')
  }

  onClickEditUser =  (id) => this.setState({open: true, idUpdate: id});

  onClickDeleteUser = (e) => this.setState({idDelete: e});

  render() {
    let { open, idUpdate, idDelete }  = this.state;
    let { groups, channel, agency } = this.props;
    let { data, ordered }   = groups;
    let dataGroup           = idUpdate ? data[idUpdate] : null;

    if (groups.isWorking ) return <Loading />;

    return (
      <Fragment>
        <RightSidebar
          open = {open} onClose = {this.closeRightSidebar}
          title = {`${ idUpdate ? "Edit" : "Create"} group`}
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
                      <th width="200px">Channel</th>
                      <th width="150px" >Agency</th>
                      <th width="100px" className="text-center">Action</th>
                    </tr>
                  </thead>

                  <Item
                    onClickEditUser   = { this.onClickEditUser }
                    onClickDeleteUser = { this.onClickDeleteUser }
                    data              = { data }
                    agency            = { agency.data }
                    channel           = { channel.data }
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
  let { groups, profile, categories } = state;
  let { channel, agency } = categories;
  return { groups, profile, channel, agency };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    groupActions            : bindActionCreators(groupActions, dispatch),
    channelActions         : bindActionCreators(channelActions, dispatch),
    agencyActions          : bindActionCreators(agencyActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));
