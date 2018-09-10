// @flow

import * as React from 'react';
import { Column, Table, AutoSizer } from 'react-virtualized';

import 'react-virtualized/styles.css';
import './DataTable.css';

class DataTable extends React.Component {

  noRowRenderer = (): React.Node => {
    return (<div>No rows</div>);
  }

  renderColumns = () => {
    let { columnsDesc } = this.props;
    return columnsDesc.map((col) => {
      return <Column key={ col.dataKey } { ...col } />
    });
  };

  render() {
    return (
      <AutoSizer disableHeight>
        {({ width }) => {
          return (
            <Table
              className="Table"
              noRowsRenderer={ this.noRowRenderer }
              width={ width }
              { ...this.props.tableDesc } >
              { this.renderColumns() }
            </Table>
          )}
        }
      </AutoSizer>
    );
  }
}

export default DataTable;