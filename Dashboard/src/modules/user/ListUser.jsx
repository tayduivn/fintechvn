import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import { actions as userActions } from 'modules/user';
import { actions as agencyActions } from 'modules/categories/agency';
import { actions as channelActions } from 'modules/categories/channel';
import { RightSidebar, Loading } from 'components';
import FormAdd from './FormAdd';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      open      : false,
      userFetch : false,
      idUser    : null
    }
  }

  componentDidUpdate(nextProps){
    let { profile, users} = nextProps;
    let { userFetch } = this.state;
    if(!!profile.info && users.ordered.length === 0 && !users.isWorking && !userFetch){

      let where = {};

      if(profile.info && profile.info.account_type === 0)
        where = { account_type : 1 };
      else
        where = { created_at : profile.info.id };
        
      let include = {
        include: [
          {relation: "agency", scope: { fields: { name: true}}},
          {relation: "channel", scope: { fields: { name: true }}},
        ]
      };

      this.props.userActions.fetchAll(include, 0, 0, where)
        .finally( () => this.setState({userFetch: true}))
    }
  }

  componentDidMount(){
    let { agency, channel,
      breadcrumbActions, agencyActions, channelActions} = this.props;

    breadcrumbActions.set({
      page_name: 'Dashboard',
      breadcrumb: [{
        name: "Users",
        liClass: "active"
      }]
    });
    
    if(agency.ordered.length === 0) agencyActions.fetchAll();
    if(channel.ordered.length === 0) channelActions.fetchAll();
  }

  openRightSidebar = () => {
    this.setState({open: true});
  }

  closeRightSidebar = () => {
    this.setState({open: false, idUser: null});
  }

  formSubmitDataUser = (data) => {
    let { profile, userActions, notification} = this.props;
    let { idUser } = this.state;

    let account_type = (profile.info && profile.info.account_type === 0) ? 1 : 2;
    data.account_type = account_type;
    data.created_at = profile.info.id;

    if(!idUser) {
      userActions.create(data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Create user success');
      })
      .catch(e => notification.e('Error', e.messagse))
      .finally( this.setState({open: false, idUser: null}))
    }
    else {
      userActions.updateById(idUser, data)
        .then(res => {
          if(res.error) return Promise.reject(res.error);
          if(!res.data) return Promise.reject({messagse: "unknown error"});
          if(res.data) notification.s('Messagse', 'Update user success');
        })
        .catch(e => notification.e('Error', e.messagse))
        .finally( this.setState({open: false, idUser: null}))
    }
  }

  onClickEditUser =  (id) => () => {
    this.setState({open: true, idUser: id});
  }

  render() {
    let { open, idUser } = this.state;
    let { users, agency, channel, profile } = this.props;
    let { data, ordered } = users;
    
    if (users.isWorking || agency.isWorking || channel.isWorking) return <Loading />;

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
            idUser              = { idUser}
            profile             = { profile }
            formSubmitDataUser  = { this.formSubmitDataUser }
            onClose             = { this.closeRightSidebar } />
        </RightSidebar>
        <div className="row">
          <div className="col-md-12 col-lg-12 col-sm-12">
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
                  <tbody>
                    {
                      ordered.length > 0
                      ? (
                        ordered.map( (e, i) => {
                          return (
                            <tr key={i}>
                              <td>
                                <span className="font-medium">{data[e].email}</span>
                              </td>
                              <td>
                                <span className="font-medium">{`${data[e].firstname} ${data[e].lastname}`}</span>
                              </td>
                              <td>{ (data[e].gender && data[e].gender === 1) ? 'Male' : 'Female' }</td>
                              <td>{data[e].channel.name}</td>
                              <td>
                                {data[e].agency.name}
                              </td>
                              <td className="text-center">
                                <span className={`label label-${ (data[e].status && data[e].status === 1) ? 'success' : 'danger' }`}>
                                  { (data[e].status && data[e].status === 1) ? 'Active' : 'Unactive' }
                                </span>
                              </td>
                              <td className="text-center">
                              
                                <button onClick={ this.onClickEditUser(e) } className="p-0 btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                                  <i className=" ti-pencil" aria-hidden="true"></i>
                                </button>
                                {/* <button className="btn-save btn btn-sm btn-icon btn-pure btn-outline delete-row-btn">
                                  <i className="ti-trash" aria-hidden="true"></i>
                                </button> */}
                              </td>
                            </tr>
                          )
                        })
                      )
                      : null
                    }
                  </tbody>
                </table>
              </div>
              {/* <div className="row p-10">
                <div className="col-md-6">
                  <div className="dataTables_info" id="editable-datatable_info" role="status" aria-live="polite">Hiển thị 1 đến 10 trong 57 phiếu</div>
                </div>
                <div className="col-md-6 text-right">
                  <div className="dataTables_paginate paging_simple_numbers" id="editable-datatable_paginate">
                    <ul className="pagination">
                      <li className="paginate_button first disabled" aria-controls="editable-datatable" tabIndex={0}>
                        <Link to="#"><i className="fa fa-angle-double-left" /></Link>
                      </li>
                      <li className="paginate_button previous disabled" aria-controls="editable-datatable" tabIndex={0}>
                        <Link to="#"><i className="fa fa-angle-left" /></Link>
                      </li>
                      <li className="paginate_button" aria-controls="editable-datatable" tabIndex={0}>
                        <span>...</span>
                      </li>
                      <li className="paginate_button active" aria-controls="editable-datatable" tabIndex={0}>
                        <Link to="#">2</Link>
                      </li>
                      <li className="paginate_button " aria-controls="editable-datatable" tabIndex={0}>
                        <Link to="#">3</Link>
                      </li>
                      <li className="paginate_button " aria-controls="editable-datatable" tabIndex={0}>
                        <Link to="#">4</Link>
                      </li>
                      <li className="paginate_button " aria-controls="editable-datatable" tabIndex={0}>
                        <Link to="#">5</Link>
                      </li>
                      <li className="paginate_button " aria-controls="editable-datatable" tabIndex={0}>
                        <Link to="#">6</Link>
                      </li>
                      <li className="paginate_button" aria-controls="editable-datatable" tabIndex={0}>
                        <span>...</span>
                      </li>
                      <li className="paginate_button next" aria-controls="editable-datatable" tabIndex={0}>
                        <Link to="#"><i className="fa fa-angle-right" /></Link>
                      </li>
                      <li className="paginate_button last" aria-controls="editable-datatable" tabIndex={0}>
                        <Link to="#"><i className="fa fa-angle-double-right" /></Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div> */}
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