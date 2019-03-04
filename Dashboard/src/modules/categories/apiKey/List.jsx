import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, AlertConfirm } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as apiKeyActions from './actions';
import { actions as channelActions } from 'modules/categories/channel';
import { actions as agencyActions } from 'modules/categories/agency';
import { RightSidebar } from 'components';
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
    let { breadcrumbActions, apiKey, apiKeyActions, agencyActions, channelActions } = this.props;
    
    this.setState({loading: true});

    breadcrumbActions.set({
      page_name: 'API key',
      breadcrumb: [
        { name: "Categories" },
        { name: "API key", liClass: "active" }
      ]
    });

    if(apiKey.ordered.length === 0) await apiKeyActions.fetchAll();

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
    let { apiKeyActions, notification} = this.props;
    let { idUpdate } = this.state;
    if(!idUpdate) {
      this.setState({loading: true, open: false, idUpdate: null});

      let res = await apiKeyActions.create(data);

      if(!!res.error) notification.e('Error', res.error.messagse || res.error.message)
      else notification.s('Messagse', 'Create item success');

      this.setState({loading: false});
    }
    else {
      this.updateItemById(idUpdate, data, 'Update item success')
    }
  }

  updateItemById = async (id, data) => {
    let { apiKeyActions, notification} = this.props;
    
    this.setState({loading: true, open: false, idUpdate: null, idDelete: null});

    let res = await apiKeyActions.updateById(id, data);

    if(!!res.error) notification.e('Error', res.error.messagse || res.error.message)
    else notification.s('Messagse', 'Create item success');

    this.setState({loading: false});
  }

  onDeleteItem = async () => {
    let { idDelete } = this.state;

    let { apiKeyActions, notification} = this.props;
    
    this.setState({loading: true, idDelete: null});

    let res = await apiKeyActions.deleteItem(idDelete);

    if(!!res.error) notification.e('Error', res.error.messagse || res.error.message)
    else notification.s('Messagse', 'Delete item success');

    this.setState({loading: false});
  }

  onClickDeleteUser = (e) => this.setState({idDelete: e});

  onClickEditUser =  (id) => {
    this.setState({open: true, idUpdate: id});
  }

  render() {
    let { open, idUpdate, idDelete, loading }   = this.state;
    let { apiKey, agency, channel }             = this.props;
    let { data, ordered, isWorking }            = apiKey;
    let dataGroup                               = idUpdate ? data[idUpdate] : null;

    let load = (!!loading || !!isWorking ) ? ' loading' : '';

    return (
      <Fragment>
        <RightSidebar
          open = {open} onClose = {this.closeRightSidebar}
          title = {`${ idUpdate ? "Edit" : "Create"} item`}
          color = "success" >
          <FormAdd
            dataGroup       = { dataGroup }
            channel         = { channel }
            agency          = { agency }
            apiKey          = { apiKey }
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
          <div className={`col-md-12 col-lg-12 col-sm-12${load}`}>
            <div className="panel">
              <div className="p-10 p-b-0">
                <form method="post" action="#" id="filter">
                  <Link onClick={ this.openRightSidebar } to="#" className="btn btn-success pull-right">
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
                      <th>Key</th>
                      <th width="200px">Channel</th>
                      <th className="text-center" width="150px" >Agency</th>
                      <th className="text-center" width="150px" >Status</th>
                      <th width="100px" className="text-center">Action</th>
                    </tr>
                  </thead>
                    <Item
                      onClickEditUser   = { this.onClickEditUser }
                      onClickDeleteUser = { this.onClickDeleteUser }
                      updateItemById    = { this.updateItemById }
                      data              = { data }
                      agency            = { agency.data }
                      channel           = { channel.data }
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
  let { channel, apiKey, agency } = state.categories;

  return { channel, apiKey, agency };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions      : bindActionCreators(breadcrumbActions, dispatch),
    apiKeyActions          : bindActionCreators(apiKeyActions, dispatch),
    channelActions         : bindActionCreators(channelActions, dispatch),
    agencyActions          : bindActionCreators(agencyActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));
