import React from 'react'
import { agGridAdapter } from '@consta/ag-grid-adapter/agGridAdapter'
import { AgGridReact } from 'ag-grid-react'

interface IGridview {
  rowData: Array<object>;
  columnDefs: Array<object>;
}

const defaultColDef = {
  flex: 1,
  minWidth: 100,
  enableValue: true,
  enableRowGroup: true,
  enablePivot: true,
  sortable: true,
  filter: true,
  resizable: true,
}

const Table: React.FC<IGridview> = ({ rowData, columnDefs }: IGridview) => {
  const styleOptions = agGridAdapter({
    size: 'm',
    borderBetweenColumns: true,
    borderBetweenRows: true,
    headerVerticalAlign: 'center',
    headerView: 'default',
    verticalAlign: 'center',
  })
  return (
    <div className="ag-theme-quartz" style={{ height: '90%', width: '100%' }}>
      <AgGridReact
        {...styleOptions}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
      />
    </div>
  )
}

export default Table
