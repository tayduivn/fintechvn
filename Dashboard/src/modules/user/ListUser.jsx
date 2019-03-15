import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, RightSidebar, Select, Modal } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import { actions as userActions } from 'modules/user';
import { actions as agencyActions } from 'modules/categories/agency';
import { actions as channelActions } from 'modules/categories/channel';
import { actions as groupActions } from 'modules/groups';

import { rmv, isEmpty } from 'utils/functions';
import FormAdd from './FormAdd';
import Item from './Item';
import FormAddGroup from './FormAddGroup';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      open        : false,
      idUser      : null,
      loading     : false,
      agencyID    : null,
      channelID   : null,
      accountType : null,
      keyEmail    : null,
      item        : null
    }
  }

  async componentDidMount(){
    let { profile, breadcrumbActions, agencyActions, channelActions, userActions, groupActions} = this.props;

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

    let w = {removed: 0};
    if(!!profile.info.account_type) w.agency_id = profile.info.agency;

    await groupActions.fetchAll({}, 0, 0, w);

    await channelActions.fetchAll({}, 0, 0, {removed: 0});

    let where = {};

    if(profile.info && profile.info.account_type === 0)
      where = { id : { neq: profile.info.id } };
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

  onClickAddGroup = (item) => {
    this.setState({ item });
  }

  filterChange = (key, v) => {
    v = !!v && v !== "null" ? v : null;
    this.setState({[key]: v});
  }

  onChangeKeyword = () => {
    let k         = null;
    let keyEmail  = (!!this._keywordInput) ? this._keywordInput.value : "";

    if(keyEmail.trim().length >= 0 && keyEmail.trim().length < 200) k = rmv(keyEmail);

    this.setState({keyEmail: k});
  }

  checkKeyWork = (item) => {
    let { keyEmail } = this.state;
    let { email, firstname, lastname } = item;
    let fullname = `${firstname} ${lastname}`;

    email     = rmv(email);
    fullname  = rmv(fullname);

    return (!keyEmail || email.indexOf(keyEmail) !== -1 || fullname.indexOf(keyEmail) !== -1)
  }

  checkChannel = item => {
    let { channelID } = this.state;
    let idChannel = item.channel.id;
    return channelID === null || channelID === idChannel;
  }

  checkAgency = item => {
    let { agencyID }  = this.state;
    let idAgency      = item.agency.id;
    return agencyID === null || agencyID === idAgency;
  }

  checkAccountType = item => {
    let { accountType }   = this.state;
    let { account_type }  = item;

    return accountType === null || +accountType === +account_type;
  }

  onSubmitData = async (groups) => {
    let { userActions, notification} = this.props;
    let { item } = this.state;

    this.setState({loading: true, item: null });

    if(!isEmpty(groups) && !!item){
      let res = await userActions.updateById(item.id, {groups});

      if(!!res.error) notification.e('Error', res.error.messagse || res.error.message)
      else if(!!res.data) notification.s('Messagse', 'Update item success');
      else notification.e('Error', 'Unknown error');

    }else notification.e('Error', 'Group invalid');

    this.setState({loading: false, item: null });
  }

  render() {
    let { open, idUser, loading, channelID, item } = this.state;
    let { users, agency, channel, profile, groups } = this.props;
    let { data, ordered } = users;

    let isWorking = users.isWorking || agency.isWorking || channel.isWorking || groups.isWorking;

    let load = (!!loading || !!isWorking ) ? ' loading' : '';

    let orderedN = ordered.filter(e => {
      let item = data[e];

      let flag = !!item ? true : false;

      if(!flag) return false;

      flag = !!flag && this.checkKeyWork(item);
      flag = !!flag && this.checkChannel(item);
      flag = !!flag && this.checkAgency(item);
      flag = !!flag && this.checkAccountType(item);
      return flag;
    })

    let optionAccountType = [
      { text: '-- Select account type', value: "null" },
      { text: 'Admin', value: 0 },
      { text: 'Agency super', value: 1 },
      { text: 'Agency user', value: 2 },
    ];

    let optionChannel = [{ text: '-- Select channel', value: "null" }];

    for(let i of channel.ordered){
      let item = channel.data[i];
      if(!!item && !item.removed) optionChannel.push({ text: item.name, value: i })
    }

    let optionAgency = [{ text: '-- Select agency', value: "null" }];

    for(let i of agency.ordered){
      let item = agency.data[i];
      if(!!item && !item.removed && ( channelID === null || channelID === item.channel.id ) ) optionAgency.push({ text: item.name, value: i })
    }

    return (
      <Fragment>

        <Modal
          open    = { !!item ? true : false }
          header  = "Add group user" >
          <FormAddGroup
            clickCreateItem = { this.clickCreateItem }
            item          = { item }
            groups        = { groups }
            onSubmitData  = { this.onSubmitData }
            close         = { () => this.setState({item: null}) } />
        </Modal>

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
              <div className="row p-t-15">
                <div className="col-md-10">
                  <div className="col-md-2">
                    <Select
                      onChange = { v => this.filterChange('channelID', v)}
                      options  = { optionChannel }
                    />
                  </div>
                  <div className="col-md-2">
                    <Select
                      onChange = { v => this.filterChange('agencyID', v)}
                      options  = { optionAgency }
                    />
                  </div>
                  <div className="col-md-2">
                    <Select
                      onChange = { v => this.filterChange('accountType', v)}
                      options  = { optionAccountType }
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      onChange      = { this.onChangeKeyword }
                      ref           = { e => this._keywordInput = e}
                      className="form-control" placeholder="Enter email....." />
                  </div>
                </div>
                <div className="col-md-2 text-right">
                  <Link onClick={ this.openRightSidebar } to="#" className="btn btn-success pull-right m-r-15">
                    <i className="fa fa-plus" /> Create new user
                  </Link>
                </div>
              </div>
              <div className="p-10 p-b-0">
                <form method="post" action="#" id="filter">

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
                      <th className="text-center" width="100px">Account Type</th>
                      <th>Channel</th>
                      <th>Agency</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>

                  <Item
                    onClickEditUser = { this.onClickEditUser }
                    onClickAddGroup = { this.onClickAddGroup }
                    data            = { data }
                    ordered         = { orderedN } />
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
  let { users, profile, groups } = state;
  let { agency, channel } = state.categories;

  return { users, profile, agency, channel, groups };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    userActions             : bindActionCreators(userActions, dispatch),
    agencyActions           : bindActionCreators(agencyActions, dispatch),
    channelActions          : bindActionCreators(channelActions, dispatch),
    groupActions            : bindActionCreators(groupActions, dispatch),
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));
