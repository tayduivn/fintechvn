import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, RightSidebar } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import { actions as userActions } from 'modules/user';
import { actions as agencyActions } from 'modules/categories/agency';
import { actions as channelActions } from 'modules/categories/channel';
import FormAdd from './FormAdd';
import Item from './Item';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      open      : false,
      idUser    : null,
      loading   : false
    }
  }

  async componentDidMount(){
    let { profile, breadcrumbActions, agencyActions, channelActions, userActions} = this.props;

    this.setState({loading: true});

    breadcrumbActions.set({
      page_name: 'Dashboard',
      breadcrumb: [{
        name: "Users",
        liClass: "active"
      }]
    });

    await agencyActions.fetchAll({
      include: [
        {relation: "channel", scope: { fields: { name: true, path: true, channel_type: true}}},
      ]
    }, 0, 0, {removed: 0});

    await channelActions.fetchAll({}, 0, 0, {removed: 0});

    let where = {};

    if(profile.info && profile.info.account_type === 0)
      where = { account_type : {neq: 2}, id : { neq: profile.info.id } };
    else
      where = { created_at : profile.info.id };

    let include = {
      include: [
        {relation: "agency", scope: { fields: { name: true}}},
        {relation: "channel", scope: { fields: { name: true }}},
      ]
    };

    await userActions.fetchAll(include, 0, 0, where);

    this.setState({loading: false});
  }

  openRightSidebar = () => this.setState({open: true});

  closeRightSidebar = () => this.setState({open: false, idUser: null});

  formSubmitDataUser = async (data) => {
    let { profile, userActions, notification} = this.props;
    let { idUser } = this.state;

    this.setState({loading: true, open: false, idUser: null});

    let account_type = (profile.info && profile.info.account_type === 0) ? 1 : 2;

    if(undefined !== data.channelType){
      if(!data.channelType) account_type = 0;
      delete data.channelType;
    }

    data.account_type = account_type;
    data.created_at = profile.info.id;

    if(!idUser) {

      let res = await userActions.create(data);

      if(!!res.error) notification.e('Error', res.error.messagse || res.error.message)
      else if(!!res.data) notification.s('Messagse', 'Create item success');
      else notification.e('Error', 'Unknown error');

    }
    else {
      let res = await userActions.updateById(idUser, data);

      if(!!res.error) notification.e('Error', res.error.messagse || res.error.message)
      else if(!!res.data) notification.s('Messagse', 'Update item success');
      else notification.e('Error', 'Unknown error');
    }

    this.setState({loading: false});
  }

  onClickEditUser =  (id) => this.setState({open: true, idUser: id});

  render() {
    let { open, idUser, loading } = this.state;
    let { users, agency, channel, profile } = this.props;
    let { data, ordered } = users;

    let isWorking = users.isWorking || agency.isWorking || channel.isWorking;

    let load = (!!loading || !!isWorking ) ? ' loading' : '';

    return (
      <Fragment>
        <RightSidebar
          open = {open} onClose = {this.closeRightSidebar}
          title = {`${ idUser ? "Edit" : "Create"} user`}
          color = "success" >
          <FormAdd
            agency              = { agency }
            channel             = { channel }
            users               = { users }
            idUser              = { idUser }
            user                = {  !!data[idUser] ? data[idUser] : null }
            profile             = { profile }
            formSubmitDataUser  = { this.formSubmitDataUser }
            onClose             = { this.closeRightSidebar } />
        </RightSidebar>
        <div className="row">
          <div className={`col-md-12 col-lg-12 col-sm-12${load}`}>
            <div className="panel">
              <div className="p-10 p-b-0">
                <form method="post" action="#" id="filter">
                  <Link onClick={ this.openRightSidebar } to="#" className="btn btn-success pull-right">
                    <i className="fa fa-plus" /> Create new user
                  </Link>
                  <div className="clear"></div>
                </form>
              </div>
              <hr style={{marginTop: '10px'}}/>
              <div className="table-responsive">
                <table className="table table-hover manage-u-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Fullname</th>
                      <th>Gender</th>
                      <th>Channel</th>
                      <th>Agency</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>

                  <Item
                    onClickEditUser = { this.onClickEditUser }
                    data            = { data }
                    ordered         = { ordered } />
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
  let { users, profile } = state;
  let { agency, channel } = state.categories;

  return { users, profile, agency, channel };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    userActions             : bindActionCreators(userActions, dispatch),
    agencyActions           : bindActionCreators(agencyActions, dispatch),
    channelActions           : bindActionCreators(channelActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));
