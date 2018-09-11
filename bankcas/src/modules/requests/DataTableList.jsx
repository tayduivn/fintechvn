import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react'

import { DataTable } from 'components';
import { convertDMY } from 'utils/format';
import './customTable.css';

class DataTableList extends Component {

  rowClassName = ({ index }: { index: number }): string => {

    if (index < 0) {
      return "headerRow";
    } else {
      return index % 2 === 0 ? "evenRow" : "oddRow";
    }
  }
  
  rowGetter = ({ index }: { index: number }): any => {
    let {ordered, data} = this.props;
    let res = data[ordered[index]];

    let dateCreated = convertDMY(res.create_at); // `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`;
    
    let firstname = (res.users.firstname) ? res.users.firstname : '';
    let lastname  = (res.users.lastname) ? res.users.lastname : '';

    let created_by  = `${firstname} ${lastname}`;
    let productName = (res.product.name) ? res.product.name : '';

    let status = res.status;
    let statusName = "Mới";
    if(status === 1)
      statusName = "Đã gửi";
    else if (status === 2)
      statusName = "Đã phản hồi";
    return {index, status, ...res.detail, created_by, productName, dateCreated, statusName, id: ordered[index]};
  }

  handelEdit = (id) => {
    let url = `/requests/edit/${id}`;
    this.props.history.push(url);
  }

  handelView = (id) => {
    let url = `/requests/view/${id}`;
    this.props.history.push(url);
  }

  handelClone = (id) => {
    let url = `/requests/clone/${id}`;
    this.props.history.push(url);
  }

  cellRenderer = ({rowData}): React.Node =>{
    let {id, status} = rowData;
    let { t } = this.props;
    return (
      <Dropdown icon='ellipsis horizontal' >
        <Dropdown.Menu>
          {(status === 1 || status === 2) ? <Dropdown.Item onClick={() => this.handelView(id) } text={t('requests:acView')} icon="eye" /> : null}
          {(status !== 1 && status !== 2) ? <Dropdown.Item onClick={() => this.handelEdit(id) } text={t('requests:acEdit')} icon="pencil alternate" /> : null}
          {(status === 0) ? <Dropdown.Item onClick={this.props.handelSendCIS(id)} text={t('requests:acSend')} icon="paper plane outline"/> : null}
          {(status === 0) ? <Dropdown.Item onClick={this.props.handelClickDelete(id)} text={t('requests:acDel')} icon="trash alternate outline" /> : null}
          <Dropdown.Item onClick={() => this.handelClone(id) } text={t('requests:acClone')} icon="clone outline"  />
        </Dropdown.Menu>
      </Dropdown>);
  }

  render() {
    let { t } = this.props;

    let tableDesc: TableDesc = {
      disableHeader: false,
      headerHeight: 40,
      height: this.props.ordered.length * 40 + 40,
      rowCount: this.props.ordered.length,
      rowHeight: 40,
      rowGetter: this.rowGetter,
      rowClassName: this.rowClassName,
    };
  
    let columnsDesc: Array<ColumnDesc> = [{
      label: t('requests:id'),
      dataKey: 'index',
      width: 50,
      style: {textAlign: 'center'}
    },{
      label: t('requests:customer'),
      dataKey: 'policy_holder',
      width: 200
    },{
      label: t('requests:ssn'),
      dataKey: 'id_number',
      width: 200
    },{
      label: t('requests:product'),
      dataKey: 'productName',
      width: 200,
    },{
      label: t('requests:insured'),
      dataKey: 'address',
      width: 300
    },{
      label: t('requests:createdAt'),
      dataKey: 'dateCreated',
      width: 200
    },{
      label: t('requests:createdBy'),
      dataKey: 'created_by',
      width: 200
    },{
      label: t('requests:status'),
      dataKey: 'statusName',
      width: 200
    },{
      label: t('requests:action'),
      dataKey: 'index',
      className: 'action',
      width: 200,
      cellRenderer: this.cellRenderer
    }];

    return (
      <DataTable tableDesc={ tableDesc } columnsDesc={ columnsDesc } />
    );
  }
}

export default DataTableList;