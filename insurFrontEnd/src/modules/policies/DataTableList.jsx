import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react'

import { DataTable } from 'components';
import { formatPrice, convertDMY } from 'utils/format';
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

    let firstname = (res.users.firstname) ? res.users.firstname : '';
    let lastname  = (res.users.lastname) ? res.users.lastname : '';

    let created_by  = `${firstname} ${lastname}`;
    let productName = (res.product.name) ? res.product.name : '';

    let { code, status, startDay, endDay, price  } = res;

    startDay = convertDMY(startDay);
    endDay = convertDMY(endDay);    

    price = formatPrice(price, ' VNĐ');
    
    let statusName = "Mới";
    if(status === 1)
      statusName = "Đã gửi";
    else if (status === 2)
      statusName = "Đã phản hồi";

    return {index, code, status, startDay, endDay, price, ...res.detail, created_by, productName, statusName, id: ordered[index]};
  }


  handelView = (id) => () => {
    let url = `/policies/view/${id}`;
    this.props.history.push(url);
  }

  handelClone = (id) => () => {
    let url = `/requests/clone/${id}`;
    this.props.history.push(url);
  }

  handelPrint = (id) => () => {
    let url = `/policies/print/${id}`;
    this.props.history.push(url);
  }

  cellRenderer = ({rowData}): React.Node =>{
    let { id } = rowData;
    let { t } = this.props;

    return (
      <Dropdown icon='ellipsis horizontal' >
        <Dropdown.Menu>
          <Dropdown.Item onClick={this.handelView(id) } text={t('policies:acView')} icon="eye" />
          <Dropdown.Item onClick={this.handelPrint(id) } text={t('policies:acPrint')} icon="file outline" /> 
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
      label: t('policies:id'),
      dataKey: 'code',
      width: 150
    },{
      label: t('policies:customer'),
      dataKey: 'policy_holder',
      width: 200
    },{
      label: t('policies:startDate'),
      dataKey: 'startDay',
      width: 200
    },{
      label: t('policies:endDate'),
      dataKey: 'endDay',
      width: 200
    },{
      label: t('policies:premium'),
      dataKey: 'price',
      width: 300
    },{
      label: t('policies:products'),
      dataKey: 'productName',
      width: 200
    },{
      label: t('policies:insuredObject'),
      dataKey: 'address',
      width: 200
    },{
      label: t('policies:createdBy'),
      dataKey: 'created_by',
      width: 200
    },{
      label: t('policies:action'),
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
