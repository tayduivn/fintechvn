import React, { Component } from 'react';
import { DataTable } from 'components';

class DataTableList extends Component {

  rowClassName = ({ index }: { index: number }): string => {
    if (index < 0) {
      return "headerRow";
    } else {
      return index % 2 === 0 ? "evenRow" : "oddRow";
    }
  }
  
  rowGetter = ({ index }: { index: number }): any => {
    return { index};
  }

  cellRenderer = (e: any): React.Node =>{
    return (
      <div className="btn-group" role="group">
        
      </div>);
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
      dataKey: 'index',
      width: 50
    },{
      label: t('policies:customer'),
      dataKey: 'index',
      width: 200
    },{
      label: t('policies:startDate'),
      dataKey: 'index',
      width: 200
    },{
      label: t('policies:endtDate'),
      dataKey: 'index',
      width: 200
    },{
      label: t('policies:premium'),
      dataKey: 'index',
      width: 300
    },{
      label: t('policies:products'),
      dataKey: 'index',
      width: 200
    },{
      label: t('policies:insuredObject'),
      dataKey: 'index',
      width: 200
    },{
      label: t('policies:createdBy'),
      dataKey: 'index',
      width: 200
    },{
      label: t('policies:action'),
      dataKey: 'index',
      width: 200,
      cellRenderer: this.cellRenderer
    }];

    return (
      <DataTable tableDesc={ tableDesc } columnsDesc={ columnsDesc } />
    );
  }
}

export default DataTableList;