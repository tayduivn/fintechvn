import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, AlertConfirm } from 'components';
import { actions as breadcrumbActions } from 'screens/modules/breadcrumb';
import * as yearsActions from './actions';
import { RightSidebar, Loading } from 'components';
import FormAdd from './Form';
import Item from './Item';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      open      : false,
      idUpdate  : null,
      idDelete  : null,
      maxYear   : 0
    }
  }

  componentDidMount(){
    let { breadcrumbActions, years, yearsActions, profile } = this.props;

    breadcrumbActions.set({
      page_name: 'Year',
      breadcrumb: [
        { name: "Categories" },
        { name: "Year", liClass: "active" }
      ]
    });

    let where  = { removed: 0, insur_id: profile.info.agency.id};

    if(years.ordered.length === 0) yearsActions.fetchAll(null, 0, 0, where);
    
  }

  openRightSidebar = () => {
    this.setState({open: true});
  }

  closeRightSidebar = () => {
    this.setState({open: false, idUpdate: null});
  }

  formSubmitData = (data) => {
    let { yearsActions, notification, profile} = this.props;
    data.insur_id = profile.info.agency.id;

    yearsActions.create(data)
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', 'Create item success');
      })
      .catch(e => notification.e('Error', e.messagse))
      .finally( this.setState({open: false, idUpdate: null}))
  }

  updateItemById = (id, data, titleS) => {
    let { yearsActions, notification} = this.props;

    yearsActions.updateById(id, data)
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
    this.updateItemById(idDelete, {removed: 1}, 'Delete item success')
  }

  onClickDeleteUser = (e) => this.setState({idDelete: e});

  render() {
    let { open, idUpdate, idDelete }  = this.state;
    let { years } = this.props;
    let { data, ordered, isWorking }   = years;
    let dataGroup           = idUpdate ? data[idUpdate] : null;
    
    if (isWorking ) return <Loading />;

    return (
      <Fragment>
        <RightSidebar
          open = {open} onClose = {this.closeRightSidebar}
          title = {`${ idUpdate ? "Edit" : "Create"} year`}
          color = "success" >
          <FormAdd
            dataGroup       = { dataGroup }
            maxYear         = { this.state.maxYear }
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
                    <i className="fa fa-plus" /> Create new year
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
                      maxYear           = {max => this.setState({maxYear: max})}
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
  let { years } = state.categories;
  let { profile } = state;

  return { years, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    breadcrumbActions       : bindActionCreators(breadcrumbActions, dispatch),
    yearsActions          : bindActionCreators(yearsActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));