import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { withNotification, AlertConfirm, Loading } from 'components';
import * as feeAssetHouseActions from './actions';
import Item from './Item';

class ListUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      idDelete  : null
    }
  }

  componentDidMount(){
    let { feeAssetHouse, feeAssetHouseActions, profile } = this.props;

    let where  = { removed: 0, insur_id: profile.info.agency.id};

    if(feeAssetHouse.ordered.length === 0) feeAssetHouseActions.fetchAll(null, 0, 0, where);
  }

  onDeleteItem = () => {
    let { idDelete } = this.state;
    let { feeAssetHouseActions, notification} = this.props;

    feeAssetHouseActions.updateById(idDelete, {removed: 1})
      .then(res => {
        if(res.error) return Promise.reject(res.error);
        if(!res.data) return Promise.reject({messagse: "unknown error"});
        if(res.data) notification.s('Messagse', "Delete item success");
      })
      .catch(e => notification.e('Error', e.messagse))
      .finally( this.setState({idDelete: null}))

    // this.updateItemById(idDelete, {removed: 1}, 'Delete item success')
  }

  onClickDeleteItem = (e) => this.setState({idDelete: e});

  render() {
    let { idDelete }  = this.state;
    let { feeAssetHouse } = this.props;
    let { data, ordered, isWorking }   = feeAssetHouse;
    
    if (isWorking ) return <Loading />;

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
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="panel">
              <div className="p-10 p-b-0">
                <form method="post" action="#" id="filter">
                  <Link to="/categories/fee-asset-house/create" className="btn btn-success pull-right">
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
                      <th>Price</th>
                      <th width="100px" className="text-center">Action</th>
                    </tr>
                  </thead>
                    <Item
                      onClickDeleteItem = { this.onClickDeleteItem }
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
  let { feeAssetHouse } = state.categories;
  let { profile } = state;

  return { feeAssetHouse, profile };
};

let mapDispatchToProps = (dispatch) => {
  return {
    feeAssetHouseActions          : bindActionCreators(feeAssetHouseActions, dispatch)
  };
};

export default withNotification(connect(mapStateToProps, mapDispatchToProps)(ListUser));